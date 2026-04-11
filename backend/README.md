# Backend

## Development

`docker compose up`

## Architecture Notes

### Account Model

Parents and children are separate entity types. Parents register with email/password and manage the family. Children have no credentials — they interact via kiosk mode, which is scoped to their family but requires no login.

### Auth Flow

A parent logs in by looking up `AUTH#EMAIL#<email>` / `#METADATA`, which resolves to a `parentId` and `familyId`. This avoids a GSI. Multiple auth lookup items can point to the same parent to support linking additional providers (Google, Apple) in future.

### Child Account Login (future)

To support child logins, add a `passwordHash` to the child entity (ie `CHILD#<childId>` item) and write an `AUTH#EMAIL#<email>` lookup item that includes a `childId` field (and a `role: "child"` field to distinguish it from parent auth). The JWT would carry `childId` + `familyId` instead of `parentId` + `familyId`, and a separate middleware guard would protect child-only routes.

````
## DynamoDB Key Schema

| Entity                 | PK                   | SK                                |
| ---------------------- | -------------------- | --------------------------------- |
| Family                 | `FAM#<familyId>`     | `#METADATA`                       |
| Parent (family-scoped) | `FAM#<familyId>`     | `PARENT#<parentId>`               |
| Child                  | `FAM#<familyId>`     | `CHILD#<childId>`                 |
| Balance                | `FAM#<familyId>`     | `BALANCE#<childId>`               |
| Chore Template         | `FAM#<familyId>`     | `TMPL#<templateId>`               |
| Chore Assignment       | `FAM#<familyId>`     | `ASSIGN#<childId>#<assignmentId>` |
| Chore History          | `FAM#<familyId>`     | `HIST#<childId>#<completedAt>`    |
| Parent Account         | `PARENT#<parentId>`  | `#METADATA`                       |
| Auth Lookup            | `AUTH#EMAIL#<email>` | `#METADATA`                       |
| Kiosk OTP              | `OTP#<otp>`          | `#METADATA`                       |

## DynamoDB Local Commands

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

```bash
aws dynamodb create-table \
  --table-name cianandsimon \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

```bash
aws dynamodb get-item \
  --table-name cianandsimon \
  --key '{"PK": {"S": "NAME#Cian"}, "SK": {"S": "BALANCE#Cian"}}' \
  --endpoint-url http://localhost:8000
```

```bash
aws dynamodb query \
  --endpoint-url http://localhost:8000 \
  --table-name cianandsimon \
  --key-condition-expression "PK = :pk AND begins_with(SK, :sk)" \
  --expression-attribute-values '{":pk": {"S": "NAME#Cian"}, ":sk": {"S": "TRANSACTION#"}}' \
  --scan-index-forward false
```
````
