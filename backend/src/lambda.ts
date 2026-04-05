import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import serverless from '@codegenie/serverless-express';
import { app } from './server';
import { handleSchedulerEvent } from './scheduler_handler';
import { SCHEDULER_EVENT_SOURCE } from './constants';

const serverlessHandler = serverless({ app, resolutionMode: 'PROMISE' });

interface SchedulerEvent {
  source: typeof SCHEDULER_EVENT_SOURCE;
  familyId: string;
  templateId: string;
}

const isSchedulerEvent = (event: unknown): event is SchedulerEvent => {
  return (event as SchedulerEvent).source === SCHEDULER_EVENT_SOURCE;
};

export const handler = async (
  event: APIGatewayProxyEvent | SchedulerEvent,
  context: Context
) => {
  if (isSchedulerEvent(event)) {
    return handleSchedulerEvent(event);
  }

  return serverlessHandler(event, context, undefined as never);
};
