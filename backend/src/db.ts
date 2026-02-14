import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const dynamodb = new DynamoDBClient(
  process.env.NODE_ENV === 'development'
    ? { endpoint: 'http://localhost:8000', region: 'us-east-1' }
    : {},
);
