import {
  GetItemCommand,
  QueryCommand,
  TransactWriteItemsCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';

import { AssignmentStatus } from '../../constants';
import { dynamodb } from '../../db';
import { createAssignment, timezoneFormatter } from '../../helpers';

export async function createAssignmentFromTemplate({
  familyId,
  templateId,
  childId,
  assignedBy,
}: {
  familyId: string;
  templateId: string;
  childId: string;
  assignedBy: string;
}): Promise<string | null> {
  const result = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `FAM#${familyId}` },
        SK: { S: `TMPL#${templateId}` },
      },
    })
  );

  if (!result.Item) return null;

  return createAssignment({
    template: result.Item,
    childId,
    familyId,
    assignedBy,
  });
}

export async function updateAssignmentSubtasks({
  familyId,
  childId,
  assignmentId,
  subtasks,
}: {
  familyId: string;
  childId: string;
  assignmentId: string;
  subtasks: Array<{ label: string; completed: boolean }>;
}): Promise<void> {
  await dynamodb.send(
    new UpdateItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `FAM#${familyId}` },
        SK: { S: `ASSIGN#${childId}#${assignmentId}` },
      },
      UpdateExpression: 'SET subtasks = :subtasks',
      ExpressionAttributeValues: {
        ':subtasks': {
          L: subtasks.map((s) => ({
            M: { label: { S: s.label }, completed: { BOOL: s.completed } },
          })),
        },
      },
      ConditionExpression: 'attribute_exists(PK)',
    })
  );
}

export async function completeAssignment({
  familyId,
  childId,
  assignmentId,
}: {
  familyId: string;
  childId: string;
  assignmentId: string;
}): Promise<boolean> {
  const result = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `FAM#${familyId}` },
        SK: { S: `ASSIGN#${childId}#${assignmentId}` },
      },
    })
  );

  if (!result.Item) return false;

  const item = result.Item;
  const value = Number(item.value.N!);
  const completedAt = new Date().toISOString();

  await dynamodb.send(
    new TransactWriteItemsCommand({
      TransactItems: [
        {
          Delete: {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
              PK: { S: `FAM#${familyId}` },
              SK: { S: `ASSIGN#${childId}#${assignmentId}` },
            },
            ConditionExpression: 'attribute_exists(PK)',
          },
        },
        {
          Update: {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
              PK: { S: `FAM#${familyId}` },
              SK: { S: `BALANCE#${childId}` },
            },
            UpdateExpression: 'ADD balance :value',
            ExpressionAttributeValues: { ':value': { N: String(value) } },
          },
        },
        {
          Put: {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: {
              PK: { S: `FAM#${familyId}` },
              SK: { S: `HIST#${childId}#${completedAt}` },
              assignmentId: { S: assignmentId },
              templateId: { S: item.templateId.S! },
              familyId: { S: familyId },
              childId: { S: childId },
              title: { S: item.title.S! },
              value: { N: item.value.N! },
              completedAt: { S: completedAt },
            },
          },
        },
      ],
    })
  );

  return true;
}

export async function updateAssignmentStatus({
  familyId,
  childId,
  assignmentId,
  status,
}: {
  familyId: string;
  childId: string;
  assignmentId: string;
  // Assignments are deleted when completed, so status can only be updated to non-COMPLETE values
  status: Exclude<AssignmentStatus, 'COMPLETE'>;
}): Promise<void> {
  await dynamodb.send(
    new UpdateItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `FAM#${familyId}` },
        SK: { S: `ASSIGN#${childId}#${assignmentId}` },
      },
      UpdateExpression:
        status === 'PENDING'
          ? 'SET #status = :status REMOVE #ttl'
          : 'SET #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
        ...(status === 'PENDING' && { '#ttl': 'ttl' }),
      },
      ExpressionAttributeValues: { ':status': { S: status } },
      ConditionExpression: 'attribute_exists(PK)',
    })
  );
}

export async function queryAssignmentsByStatus({
  familyId,
  status,
}: {
  familyId: string;
  status: AssignmentStatus;
}): Promise<
  Array<{
    assignmentId: string;
    childId: string;
    templateId: string;
    title: string;
    value: number;
    subtasks: Array<{ label: string; completed: boolean }>;
    isVerificationRequired: boolean;
    status: string;
    assignedAt: string;
    assignedBy: string;
  }>
> {
  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':pk': { S: `FAM#${familyId}` },
        ':prefix': { S: 'ASSIGN#' },
        ':status': { S: status },
      },
    })
  );

  return (result.Items ?? []).map((item) => ({
    assignmentId: item.assignmentId.S!,
    childId: item.childId.S!,
    templateId: item.templateId.S!,
    title: item.title.S!,
    value: Number(item.value.N!),
    subtasks: (item.subtasks.L ?? []).map((s) => ({
      label: s.M!.label.S!,
      completed: s.M!.completed.BOOL!,
    })),
    isVerificationRequired: item.isVerificationRequired.BOOL!,
    status: item.status.S!,
    assignedAt: item.assignedAt.S!,
    assignedBy: item.assignedBy.S!,
  }));
}

export async function getHistory({
  familyId,
  childId,
}: {
  familyId: string;
  childId?: string;
}): Promise<
  Array<{
    assignmentId: string;
    childId: string;
    templateId: string;
    title: string;
    value: number;
    completedAt: string;
  }>
> {
  const { formatter } = await timezoneFormatter(familyId);

  const startIso = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();
  const endIso = new Date().toISOString();

  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: childId
        ? 'PK = :pk AND SK BETWEEN :skStart AND :skEnd'
        : 'PK = :pk AND begins_with(SK, :prefix)',
      ...(childId
        ? {
            ExpressionAttributeValues: {
              ':pk': { S: `FAM#${familyId}` },
              ':skStart': { S: `HIST#${childId}#${startIso}` },
              ':skEnd': { S: `HIST#${childId}#${endIso}` },
            },
          }
        : {
            ExpressionAttributeValues: {
              ':pk': { S: `FAM#${familyId}` },
              ':prefix': { S: 'HIST#' },
              ':startIso': { S: startIso },
            },
            FilterExpression: 'completedAt >= :startIso',
          }),
    })
  );

  return (result.Items ?? []).map((item) => ({
    assignmentId: item.assignmentId.S!,
    childId: item.childId.S!,
    templateId: item.templateId.S!,
    title: item.title.S!,
    value: Number(item.value.N!),
    completedAt: formatter.format(new Date(item.completedAt.S!)),
  }));
}
