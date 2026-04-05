# DynamoDB Schema Redesign for Family Chore App

## Context

The current schema only tracks two hardcoded kids (Cian, Simon) with balance and transaction records. The app needs to support a full family model: parents creating families, adding kids, managing chore templates with subtasks, assigning chores, and a parental approval workflow that credits kids' balances.

**Account model**: Parents and children are separate entity types with no overlap in functionality. Parents register with email/password and manage the family. Children have no login credentials — they interact with their chores in kiosk mode (no auth required, scoped to their family).

**Auth flow**: Email/password to start, with Google and Apple OAuth supported in future. A dedicated `AUTH#<provider>#<id>` lookup item (e.g. `AUTH#EMAIL#<email>`, `AUTH#GOOGLE#<sub>`) maps credentials → `familyId` + `parentId` without needing a GSI. Login fetches this item first, then loads the full parent record. Multiple auth methods can point to the same parent by writing additional lookup items.

This is a clean-slate redesign — no backward compatibility required. No GSIs; access patterns are served via denormalized items.

---

## Table Configuration

- **Table name**: `cianandsimon`
- **Billing**: PAY_PER_REQUEST
- **PK**: String, **SK**: String
- **No GSIs**
- **TTL**: attribute `ttl` (optional cleanup of approved assignments)

---

## Key Schema

Most items share a `FAM#<familyId>` partition key, scoping every query to one family. Parent accounts exist outside the family partition until they create or join a family.

| Entity                 | PK                     | SK                                |
| ---------------------- | ---------------------- | --------------------------------- |
| Parent Account         | `PARENT#<parentId>`    | `#METADATA`                       |
| Auth Lookup            | `AUTH#<provider>#<id>` | `#METADATA`                       |
| Family                 | `FAM#<familyId>`       | `#METADATA`                       |
| Parent (family-scoped) | `FAM#<familyId>`       | `PARENT#<parentId>`               |
| Child                  | `FAM#<familyId>`       | `CHILD#<childId>`                 |
| Balance                | `FAM#<familyId>`       | `BALANCE#<childId>`               |
| Chore Template         | `FAM#<familyId>`       | `TMPL#<templateId>`               |
| Chore Assignment       | `FAM#<familyId>`       | `ASSIGN#<childId>#<assignmentId>` |
| Chore Complete         | `FAM#<familyId>`       | `HIST#<childId>#<createdAt ISO>`  |

**SK prefix ordering note**: `#` (ASCII 35) sorts before letters, so `#METADATA` sorts to the top. `TMPL#` and `TMPL_REF#` are distinct because `#` ≠ `_` — `begins_with(SK, "TMPL#")` will never match `TMPL_REF#...` items.

---

## Entity Attributes

### Family

```
PK, SK, familyId (UUID), name, timezone, createdAt
```

### Parent Account (standalone)

```
PK = PARENT#<parentId>, SK = #METADATA
parentId (UUID), email, passwordHash (optional), createdAt
```

Created at registration. Family memberships are tracked via `FAM#<familyId>` / `PARENT#<parentId>` items — a parent can belong to multiple families.

### Parent (family-scoped)

```
PK = FAM#<familyId>, SK = PARENT#<parentId>
parentId, familyId, name, createdAt
```

Written when the parent creates a family. References the same `parentId` as the standalone account.

### Child

```
PK, SK, childId (UUID), familyId, name, createdAt
```

No credentials — interacts via kiosk mode only.

### Auth Lookup

```
PK, SK, familyId, parentId
```

Keyed as `AUTH#<provider>#<id>` / `#METADATA`, e.g. `AUTH#EMAIL#<email>`, `AUTH#GOOGLE#<sub>`, `AUTH#APPLE#<sub>`. Resolves credentials → familyId + parentId during login. Written atomically with the parent on registration. `ConditionExpression: attribute_not_exists(PK)` prevents duplicate registration per provider. Multiple lookup items can point to the same parent to support linking additional auth methods.

### Balance

```
PK, SK, childId, familyId, balance (integer), updatedAt
```

Separate from Child so `ADD` updates are atomic without read-modify-write.

### Chore Template

```
PK, SK, templateId (UUID), familyId, title, valueCents (integer), subtasks (string[]),
createdAt, createdBy (parentId), isArchived (boolean)
```

Never deleted — archived so completed history titles remain accurate.

### Template→Assignment Link

```
PK, SK, templateId, assignmentId, childId, assignedAt
```

Written when a chore is assigned from a template. Deleted when the assignment is approved. Allows querying "all active assignments for a template" via `begins_with(SK, "TMPL_REF#<templateId>#")`.

### Chore Assignment

```
PK, SK, assignmentId (UUID), familyId, childId, templateId, title (denorm), valueCents (denorm),
subtasks ([{label: string, completed: boolean}]), status ("ACTIVE"|"PENDING"|"COMPLETE"),
assignedAt, assignedBy (parentId), completedAt (set when kid submits)
```

Stores `templateId` for back-reference. Title and valueCents are denormalized from the template at assignment time.

### Pending Verification

```
PK, SK, assignmentId, childId, familyId, title (denorm), valueCents (denorm), completedAt, assignedAt
```

Written when a kid marks a chore complete. Deleted (not updated) when the parent approves. Provides the parent dashboard query with no extra index.

### Completed Chore

```
PK, SK, assignmentId, templateId, familyId, childId, title (denorm), valueCents (denorm),
subtasks (final state), approvedAt, approvedBy (parentId)
```

SK uses `approvedAt` ISO timestamp so date-range queries work with `BETWEEN`.

### History

```
PK, SK, assignmentId, templateId, familyId, childId, value, title, completedAt
```

---

## Access Patterns

| Pattern                                          | Operation | Key Condition                                                                                   |
| ------------------------------------------------ | --------- | ----------------------------------------------------------------------------------------------- |
| Login                                            | GetItem   | `PK = AUTH#<provider>#<id>`, `SK = #METADATA` → yields familyId + parentId                      |
| Get parents for family                           | Query     | `PK = FAM#<id>` AND `begins_with(SK, "PARENT#")`                                                |
| Get children for family                          | Query     | `PK = FAM#<id>` AND `begins_with(SK, "CHILD#")`                                                 |
| Get chore templates for family                   | Query     | `PK = FAM#<id>` AND `begins_with(SK, "TMPL#")`                                                  |
| Get active assignments for a template            | Query     | `PK = FAM#<id>` AND `begins_with(SK, "TMPL_REF#<templateId>#")`                                 |
| Get child's active assignments                   | Query     | `PK = FAM#<id>` AND `begins_with(SK, "ASSIGN#<childId>#")` + FilterExpression `status = ACTIVE` |
| Get child's balance                              | GetItem   | `PK = FAM#<id>`, `SK = BALANCE#<childId>`                                                       |
| **Get pending verifications (parent dashboard)** | **Query** | `PK = FAM#<id>` AND `begins_with(SK, "PENDING#")`                                               |
| Get child's completed chores (last 30 days)      | Query     | `PK = FAM#<id>` AND `SK BETWEEN "DONE#<childId>#<startISO>" AND "DONE#<childId>#<endISO>"`      |
| Get child's transactions (date range)            | Query     | `PK = FAM#<id>` AND `SK BETWEEN "TXN#<childId>#<startISO>" AND "TXN#<childId>#<endISO>"`        |

---

## Key Operations

### Register (create parent account) — `TransactWriteItems` (2 writes, atomic)

1. **Put Parent Account**: new `PARENT#<parentId>` / `#METADATA` item with hashed password
2. **Put Auth Lookup**: new `AUTH#EMAIL#<email>` / `#METADATA` item. `ConditionExpression: attribute_not_exists(PK)` (prevents duplicate email registration)

### Create family — `TransactWriteItems` (2 writes, atomic)

1. **Put Family**: new `FAM#<familyId>` / `#METADATA` item. `ConditionExpression: attribute_not_exists(PK)`
2. **Put Parent (family-scoped)**: new `FAM#<familyId>` / `PARENT#<parentId>` item

### Assign a chore to a kid — `TransactWriteItems` (2 writes)

1. **Put Assignment**: new `ASSIGN#<childId>#<assignmentId>` item, status = ACTIVE, subtasks copied from template
2. **Put Template→Assignment link**: new `TMPL_REF#<templateId>#<assignmentId>` item

### Kid marks chore complete (ACTIVE → PENDING_APPROVAL) — `TransactWriteItems` (2 writes)

1. **Update Assignment**: set `status = PENDING_APPROVAL`, `completedAt = <now>`. `ConditionExpression: #status = :active` (prevents double-submit)
2. **Put Pending Verification**: new `PENDING#<childId>#<assignmentId>` item with denormalized title/value

_(DynamoDB TransactWrite supports up to 100 items)_

---

## Files to Modify

- `backend/terraform/resources/main.tf` — no GSI needed
- `backend/src/routes/transactions.ts` — update key format, add familyId scoping
- `backend/src/routes/balances.ts` — update key format (`FAM#<id>` / `BALANCE#<childId>`)
- `backend/src/server.ts` — wire new routes: `/families`, `/parents`, `/children`, `/chores/templates`, `/chores/assignments`
- `frontend/src/components/chores-card.tsx` — migrate from localStorage to API

---

## Verification

1. Register via API — verify Family, Parent, and Auth Lookup (`AUTH#EMAIL#<email>`) items exist in DynamoDB with correct PK/SK
2. Attempt duplicate email registration — verify condition expression rejects it
3. Create child, create template, assign to child — verify both `ASSIGN#` and `TMPL_REF#` items exist
4. Child marks complete — verify `PENDING#` item created, assignment status = PENDING_APPROVAL
5. Parent approves — verify all 6 TransactWrite items: PENDING deleted, ASSIGN status=APPROVED, TMPL_REF deleted, DONE item exists, balance incremented, TXN created
6. Query `begins_with(SK, "PENDING#")` — returns only pending items
7. Query completed chores with 30-day BETWEEN range — returns correct items in date order
