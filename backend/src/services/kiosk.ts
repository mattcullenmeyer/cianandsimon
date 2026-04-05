import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';

import { dynamodb } from '../db';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const OTP_TTL_SECONDS = 15 * 60; // 15 minutes
const KIOSK_JWT_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

function generateOtpCode(): string {
  const bytes = randomBytes(6);
  return Array.from(bytes)
    .map((b) => CHARS[b % CHARS.length])
    .join('');
}

export async function createOtp(familyId: string): Promise<string> {
  const otp = generateOtpCode();
  const now = Math.floor(Date.now() / 1000);
  const ttl = now + OTP_TTL_SECONDS;

  await dynamodb.send(
    new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        PK: { S: `OTP#${otp}` },
        SK: { S: '#METADATA' },
        familyId: { S: familyId },
        ttl: { N: String(ttl) },
      },
    })
  );

  return otp;
}

export async function exchangeOtpForToken(otp: string): Promise<string | null> {
  const getResult = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `OTP#${otp}` },
        SK: { S: '#METADATA' },
      },
    })
  );

  const item = getResult.Item;
  if (!item) return null;

  const now = Math.floor(Date.now() / 1000);
  if (Number(item.ttl.N) < now) return null;

  const familyId = item.familyId.S!;

  await dynamodb.send(
    new DeleteItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `OTP#${otp}` },
        SK: { S: '#METADATA' },
      },
    })
  );

  return sign({ familyId }, process.env.JWT_SECRET!, {
    expiresIn: KIOSK_JWT_TTL_SECONDS,
  });
}
