import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import serverless from '@codegenie/serverless-express';
import { app } from './server';

const serverlessHandler = serverless({ app, resolutionMode: 'PROMISE' });

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  return serverlessHandler(event, context, undefined as never);
};
