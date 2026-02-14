import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { Router } from 'express';

import { dynamodb } from '../db';

const router: Router = Router();

router.get('/:name', async (req, res) => {
  const name = req.params.name;

  const result = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `NAME#${name}` },
        SK: { S: `BALANCE#${name}` },
      },
    }),
  );

  const balance = result.Item ? Number(result.Item.balance.N) : 0;

  res.status(200).json({ balance });
});

export default router;
