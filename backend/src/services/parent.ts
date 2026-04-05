import {
  BatchGetItemCommand,
  GetItemCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'crypto';
import { sign } from 'jsonwebtoken';
import { promisify } from 'util';

import { dynamodb } from '../db';

const scryptAsync = promisify(scrypt);

export async function signupParent({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string | null> {
  const normalizedEmail = email.toLowerCase();
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const passwordHash = `${salt}:${derivedKey.toString('hex')}`;
  const parentId = randomUUID();
  const createdAt = new Date().toISOString();

  try {
    await dynamodb.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          {
            Put: {
              TableName: process.env.DYNAMODB_TABLE_NAME,
              Item: {
                PK: { S: `PARENT#${parentId}` },
                SK: { S: '#METADATA' },
                parentId: { S: parentId },
                email: { S: normalizedEmail },
                passwordHash: { S: passwordHash },
                createdAt: { S: createdAt },
              },
            },
          },
          {
            Put: {
              TableName: process.env.DYNAMODB_TABLE_NAME,
              Item: {
                PK: { S: `AUTH#EMAIL#${normalizedEmail}` },
                SK: { S: '#METADATA' },
                parentId: { S: parentId },
              },
              ConditionExpression: 'attribute_not_exists(PK)',
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

  return parentId;
}

type LoginResult =
  | { token: string; familyId: string }
  | { token: string; families: Array<{ familyId: string; name: string }> };

export async function loginParent({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResult | null> {
  const normalizedEmail = email.toLowerCase();

  const authLookup = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `AUTH#EMAIL#${normalizedEmail}` },
        SK: { S: '#METADATA' },
      },
    })
  );

  if (!authLookup.Item) return null;

  const parentId = authLookup.Item.parentId.S!;

  const parentAccount = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `PARENT#${parentId}` },
        SK: { S: '#METADATA' },
      },
    })
  );

  if (!parentAccount.Item) return null;

  const [salt, storedHash] = parentAccount.Item.passwordHash.S!.split(':');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (
    derivedKey.length !== storedBuffer.length ||
    !timingSafeEqual(derivedKey, storedBuffer)
  ) {
    return null;
  }

  const familyIds = parentAccount.Item.familyIds?.SS ?? [];

  if (familyIds.length === 0) {
    const token = sign({ parentId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { token, families: [] };
  }

  if (familyIds.length === 1) {
    const familyId = familyIds[0];
    const token = sign({ parentId, familyId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { token, familyId };
  }

  const batchResult = await dynamodb.send(
    new BatchGetItemCommand({
      RequestItems: {
        [process.env.DYNAMODB_TABLE_NAME!]: {
          Keys: familyIds.map((id) => ({
            PK: { S: `FAM#${id}` },
            SK: { S: '#METADATA' },
          })),
        },
      },
    })
  );

  const families = (
    batchResult.Responses?.[process.env.DYNAMODB_TABLE_NAME!] ?? []
  ).map((item) => ({
    familyId: item.familyId.S!,
    name: item.name.S!,
  }));

  const token = sign({ parentId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  return { token, families };
}

export async function selectFamily({
  parentId,
  familyId,
}: {
  parentId: string;
  familyId: string;
}): Promise<string | null> {
  const parentAccount = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `PARENT#${parentId}` },
        SK: { S: '#METADATA' },
      },
    })
  );

  const familyIds = parentAccount.Item?.familyIds?.SS ?? [];
  if (!familyIds.includes(familyId)) return null;

  return sign({ parentId, familyId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}
