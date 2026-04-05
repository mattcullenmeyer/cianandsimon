import {
  CreateScheduleCommand,
  SchedulerClient,
} from '@aws-sdk/client-scheduler';
import { SCHEDULER_EVENT_SOURCE } from '../../constants';

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
  await scheduler.send(
    new CreateScheduleCommand({
      Name: templateId,
      GroupName: process.env.SCHEDULE_GROUP_NAME,
      ScheduleExpression: recurrence.rrule,
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
