import {
  CreateScheduleCommand,
  DeleteScheduleCommand,
  SchedulerClient,
} from '@aws-sdk/client-scheduler';
import { SCHEDULER_EVENT_SOURCE } from '../../constants';
import { rruleToCron } from '../../helpers';

const scheduler = new SchedulerClient({});

export async function createSchedule({
  templateId,
  recurrence,
  familyId,
}: {
  templateId: string;
  recurrence: { rrule: string; timezone: string };
  familyId: string;
}): Promise<void> {
  const cron = rruleToCron(recurrence.rrule);
  if (!cron) {
    throw new Error(`Unsupported RRULE: ${recurrence.rrule}`);
  }

  await scheduler.send(
    new CreateScheduleCommand({
      Name: `${familyId}-${templateId}`,
      GroupName: process.env.SCHEDULE_GROUP_NAME,
      ScheduleExpression: cron,
      ScheduleExpressionTimezone: recurrence.timezone,
      FlexibleTimeWindow: { Mode: 'OFF' },
      Target: {
        Arn: process.env.LAMBDA_ARN,
        RoleArn: process.env.SCHEDULER_ROLE_ARN,
        Input: JSON.stringify({
          source: SCHEDULER_EVENT_SOURCE,
          familyId,
          templateId,
        }),
      },
      ClientToken: templateId,
    })
  );
}

export async function deleteSchedule({
  familyId,
  templateId,
}: {
  familyId: string;
  templateId: string;
}): Promise<void> {
  await scheduler.send(
    new DeleteScheduleCommand({
      Name: `${familyId}-${templateId}`,
      GroupName: process.env.SCHEDULE_GROUP_NAME,
    })
  );
}
