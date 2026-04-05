import {
  AttributeValue,
  GetItemCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

import { dynamodb } from './db';

export async function timezoneFormatter(familyId: string): Promise<{
  timezone: string;
  formatter: Intl.DateTimeFormat;
}> {
  const result = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `FAM#${familyId}` },
        SK: { S: '#METADATA' },
      },
    })
  );

  const timezone = result.Item?.timezone?.S ?? 'UTC';
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return { timezone, formatter };
}

export async function createAssignment({
  template,
  childId,
  familyId,
  assignedBy,
}: {
  template: Record<string, AttributeValue>;
  childId: string;
  familyId: string;
  assignedBy: string;
}): Promise<string> {
  const assignmentId = randomUUID();
  const assignedAtMs = Date.now();
  const assignedAt = new Date(assignedAtMs).toISOString();
  const templateId = template.templateId.S!;

  const expirationSeconds = template.expirationSeconds?.N
    ? Number(template.expirationSeconds.N)
    : undefined;
  const expiresAtMs = expirationSeconds
    ? assignedAtMs + expirationSeconds * 1000
    : undefined;
  const expiresAt = expiresAtMs
    ? new Date(expiresAtMs).toISOString()
    : undefined;
  const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60;
  const ttl = expiresAtMs
    ? Math.floor(expiresAtMs / 1000) + ONE_WEEK_SECONDS
    : undefined;

  const subtasks = (template.subtasks.L ?? []).map((s) => ({
    M: {
      label: { S: s.S! },
      completed: { BOOL: false },
    },
  }));

  await dynamodb.send(
    new TransactWriteItemsCommand({
      TransactItems: [
        {
          Put: {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: {
              PK: { S: `FAM#${familyId}` },
              SK: { S: `ASSIGN#${childId}#${assignmentId}` },
              assignmentId: { S: assignmentId },
              familyId: { S: familyId },
              childId: { S: childId },
              templateId: { S: templateId },
              title: { S: template.title.S! },
              value: { N: template.value.N! },
              subtasks: { L: subtasks },
              isVerificationRequired: {
                BOOL: template.isVerificationRequired.BOOL!,
              },
              status: { S: 'ACTIVE' },
              assignedAt: { S: assignedAt },
              assignedBy: { S: assignedBy },
              ...(expiresAt && { expiresAt: { S: expiresAt } }),
              ...(ttl && { ttl: { N: String(ttl) } }),
            },
          },
        },
        {
          Update: {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
              PK: { S: `FAM#${familyId}` },
              SK: { S: `TMPL#${templateId}` },
            },
            UpdateExpression:
              'SET assignments = list_append(assignments, :newAssignment)',
            ExpressionAttributeValues: {
              ':newAssignment': { L: [{ S: assignmentId }] },
            },
          },
        },
      ],
    })
  );

  return assignmentId;
}
