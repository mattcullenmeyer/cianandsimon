import {
  QueryCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

import { dynamodb } from '../db';

export async function createFamily({
  parentId,
  name,
  timezone,
}: {
  parentId: string;
  name: string;
  timezone: string;
}): Promise<string | null> {
  const familyId = randomUUID();
  const createdAt = new Date().toISOString();

  try {
    await dynamodb.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          {
            Put: {
              TableName: process.env.DYNAMODB_TABLE_NAME,
              Item: {
                PK: { S: `FAM#${familyId}` },
                SK: { S: '#METADATA' },
                familyId: { S: familyId },
                name: { S: name },
                timezone: { S: timezone },
                createdAt: { S: createdAt },
              },
              ConditionExpression: 'attribute_not_exists(PK)',
            },
          },
          {
            Put: {
              TableName: process.env.DYNAMODB_TABLE_NAME,
              Item: {
                PK: { S: `FAM#${familyId}` },
                SK: { S: `PARENT#${parentId}` },
                parentId: { S: parentId },
                familyId: { S: familyId },
                createdAt: { S: createdAt },
              },
            },
          },
          {
            Update: {
              TableName: process.env.DYNAMODB_TABLE_NAME,
              Key: {
                PK: { S: `PARENT#${parentId}` },
                SK: { S: '#METADATA' },
              },
              UpdateExpression: 'ADD familyIds :newId',
              ExpressionAttributeValues: {
                ':newId': { SS: [familyId] },
              },
            },
          },
        ],
      })
    );
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.name === 'TransactionCanceledException'
    ) {
      return null;
    }
    throw error;
  }

  return familyId;
}

export async function addChild({
  familyId,
  parentId,
  name,
}: {
  familyId: string;
  parentId: string;
  name: string;
}): Promise<string> {
  const childId = randomUUID();
  const createdAt = new Date().toISOString();

  await dynamodb.send(
    new TransactWriteItemsCommand({
      TransactItems: [
        {
          Put: {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: {
              PK: { S: `FAM#${familyId}` },
              SK: { S: `CHILD#${childId}` },
              childId: { S: childId },
              familyId: { S: familyId },
              name: { S: name },
              createdAt: { S: createdAt },
              createdBy: { S: parentId },
            },
          },
        },
        {
          Put: {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: {
              PK: { S: `FAM#${familyId}` },
              SK: { S: `BALANCE#${childId}` },
              childId: { S: childId },
              familyId: { S: familyId },
              balance: { N: '0' },
              updatedAt: { S: createdAt },
            },
          },
        },
      ],
    })
  );

  return childId;
}

export async function getChildren(
  familyId: string
): Promise<Array<{ childId: string; name: string }>> {
  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': { S: `FAM#${familyId}` },
        ':prefix': { S: 'CHILD#' },
      },
    })
  );

  return (result.Items ?? []).map((item) => ({
    childId: item.childId.S!,
    name: item.name.S!,
  }));
}
