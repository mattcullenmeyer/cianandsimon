import {
  AttributeValue,
  GetItemCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';
import { RRule } from 'rrule';

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
  const ttl = expirationSeconds
    ? Math.floor(assignedAtMs / 1000) + expirationSeconds
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
              ':newAssignment': {
                L: [
                  {
                    M: {
                      assignmentId: { S: assignmentId },
                      childId: { S: childId },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    })
  );

  return assignmentId;
}

interface Weekday {
  weekday: number;
  n: number;
}

const RRULE_TO_EB_DAY: Record<number, string> = {
  0: 'MON',
  1: 'TUE',
  2: 'WED',
  3: 'THU',
  4: 'FRI',
  5: 'SAT',
  6: 'SUN',
};

export const rruleToCron = (rule: string): string => {
  const r = RRule.fromString(rule);
  const options = r.origOptions;

  const minutes = options.byminute ?? 0;
  const hours = options.byhour ?? 0;
  const weekdays = options.byweekday as Weekday[];

  switch (options.freq) {
    case RRule.DAILY:
      return `cron(${minutes} ${hours} * * ? *)`;

    case RRule.WEEKLY: {
      const days = weekdays
        .map((day) => RRULE_TO_EB_DAY[day.weekday])
        .join(',');
      return `cron(${minutes} ${hours} ? * ${days} *)`;
    }

    case RRule.MONTHLY: {
      const day = weekdays[0];
      const dayName = RRULE_TO_EB_DAY[day.weekday];
      const nth = day.n;
      return `cron(${minutes} ${hours} ? * ${dayName}#${nth} *)`;
    }

    default:
      throw new Error(`Unsupported recurrence frequency: ${options.freq}`);
  }
};
