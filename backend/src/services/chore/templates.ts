import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

import { dynamodb } from '../../db';
import { deleteSchedule } from './schedules';

export async function createTemplate(params: {
  familyId: string;
  parentId: string;
  title: string;
  value: number;
  subtasks: string[];
  expirationSeconds?: number;
  recurrence?: { rrule: string; childIds: string[] };
  isVerificationRequired: boolean;
}): Promise<string> {
  const {
    familyId,
    parentId,
    title,
    value,
    subtasks,
    expirationSeconds,
    recurrence,
    isVerificationRequired,
  } = params;

  const templateId = randomUUID();
  const createdAt = new Date().toISOString();

  await dynamodb.send(
    new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        PK: { S: `FAM#${familyId}` },
        SK: { S: `TMPL#${templateId}` },
        templateId: { S: templateId },
        familyId: { S: familyId },
        title: { S: title },
        value: { N: String(value) },
        subtasks: { L: subtasks.map((s) => ({ S: s })) },
        createdAt: { S: createdAt },
        createdBy: { S: parentId },
        assignments: { L: [] },
        isVerificationRequired: { BOOL: isVerificationRequired },
        ...(expirationSeconds && {
          expirationSeconds: { N: String(expirationSeconds) },
        }),
        ...(recurrence && {
          recurrence_rrule: { S: recurrence.rrule },
          recurrence_childIds: { SS: recurrence.childIds },
        }),
      },
    })
  );

  return templateId;
}

export async function getTemplate({
  familyId,
  templateId,
}: {
  familyId: string;
  templateId: string;
}): Promise<{
  templateId: string;
  familyId: string;
  title: string;
  value: number;
  subtasks: string[];
  isVerificationRequired: boolean;
  createdAt: string;
  createdBy: string;
  assignments: string[];
  expirationSeconds?: number;
  recurrence?: { rrule: string; childIds: string[] };
} | null> {
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

  const item = result.Item;
  return {
    templateId: item.templateId.S!,
    familyId: item.familyId.S!,
    title: item.title.S!,
    value: Number(item.value.N!),
    subtasks: (item.subtasks.L ?? []).map((s) => s.S!),
    isVerificationRequired: item.isVerificationRequired.BOOL!,
    createdAt: item.createdAt.S!,
    createdBy: item.createdBy.S!,
    assignments: (item.assignments.L ?? []).map((a) => a.S!),
    ...(item.expirationSeconds && {
      expirationSeconds: Number(item.expirationSeconds.N!),
    }),
    ...(item.recurrence_rrule && {
      recurrence: {
        rrule: item.recurrence_rrule.S!,
        childIds: item.recurrence_childIds.SS!,
      },
    }),
  };
}

export async function deleteTemplate({
  familyId,
  templateId,
}: {
  familyId: string;
  templateId: string;
}): Promise<boolean> {
  const result = await dynamodb.send(
    new DeleteItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `FAM#${familyId}` },
        SK: { S: `TMPL#${templateId}` },
      },
      ConditionExpression: 'attribute_exists(PK)',
      ReturnValues: 'ALL_OLD',
    })
  );

  if (!result.Attributes) return false;

  if (result.Attributes.recurrence_rrule && process.env.NODE_ENV === 'production') {
    await deleteSchedule({ familyId, templateId });
  }

  return true;
}

export async function listTemplates({
  familyId,
  type,
}: {
  familyId: string;
  type?: 'scheduled' | 'unscheduled';
}): Promise<Array<{ templateId: string; title: string; value: number }>> {
  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ProjectionExpression: 'templateId, title, #value',
      ExpressionAttributeNames: { '#value': 'value' },
      ExpressionAttributeValues: {
        ':pk': { S: `FAM#${familyId}` },
        ':prefix': { S: 'TMPL#' },
      },
      ...(type === 'scheduled' && {
        FilterExpression: 'attribute_exists(recurrence_rrule)',
      }),
      ...(type === 'unscheduled' && {
        FilterExpression: 'attribute_not_exists(recurrence_rrule)',
      }),
    })
  );

  return (result.Items ?? []).map((item) => ({
    templateId: item.templateId.S!,
    title: item.title.S!,
    value: Number(item.value.N!),
  }));
}
