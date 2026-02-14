import {
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Router } from 'express';
import { z } from 'zod';

import { dynamodb } from '../db';

const router: Router = Router();

const createTransactionSchema = z.object({
  name: z.enum(['Cian', 'Simon']),
  amount: z.number(),
  description: z.string(),
});

router.post('/', async (req, res) => {
  const result = createTransactionSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const { name, amount, description } = result.data;
  const now = new Date();
  const date = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;

  await Promise.all([
    dynamodb.send(
      new UpdateItemCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
          PK: { S: `NAME#${name}` },
          SK: { S: `BALANCE#${name}` },
        },
        UpdateExpression: 'ADD balance :amount',
        ExpressionAttributeValues: {
          ':amount': { N: String(amount) },
        },
      })
    ),
    dynamodb.send(
      new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
          PK: { S: `NAME#${name}` },
          SK: { S: `TRANSACTION#${now.toISOString()}` },
          amount: { N: String(amount) },
          description: { S: description },
          date: { S: date },
        },
      })
    ),
  ]);

  res.status(200).json({ message: 'success' });
});

router.get('/:name', async (req, res) => {
  const name = req.params.name;

  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `NAME#${name}` },
        ':sk': { S: 'TRANSACTION#' },
      },
      ScanIndexForward: false,
    })
  );

  const data = (result.Items ?? []).map((item) => ({
    amount: Number(item.amount.N),
    description: item.description.S,
    date: item.date.S,
  }));

  res.status(200).json({ data });
});

export default router;
