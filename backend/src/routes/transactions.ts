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
  const date = now.toLocaleDateString('en-US', {
    timeZone: 'America/Denver',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

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
  const start = req.query.start as string | undefined;
  const end = req.query.end as string | undefined;

  const keyCondition =
    start && end
      ? 'PK = :pk AND SK BETWEEN :skStart AND :skEnd'
      : 'PK = :pk AND begins_with(SK, :sk)';

  const expressionValues: Record<string, { S: string }> = {
    ':pk': { S: `NAME#${name}` },
  };

  if (start && end) {
    expressionValues[':skStart'] = { S: `TRANSACTION#${start}` };
    expressionValues[':skEnd'] = { S: `TRANSACTION#${end}T\uffff` };
  } else {
    expressionValues[':sk'] = { S: 'TRANSACTION#' };
  }

  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeValues: expressionValues,
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
