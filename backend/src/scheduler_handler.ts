import { GetItemCommand } from '@aws-sdk/client-dynamodb';

import { dynamodb } from './db';
import { createAssignment } from './helpers';

const handleSchedulerEvent = async (event: {
  familyId: string;
  templateId: string;
}) => {
  const { familyId, templateId } = event;

  const templateResult = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `FAM#${familyId}` },
        SK: { S: `TMPL#${templateId}` },
      },
    })
  );

  if (!templateResult.Item) {
    console.error(
      `[scheduler_handler] Template not found for familyId=${familyId} templateId=${templateId}`
    );
    return;
  }

  const childIds = templateResult.Item.recurrence_childIds?.SS ?? [];
  if (childIds.length === 0) {
    console.warn(
      `[scheduler_handler] No childIds found for template familyId=${familyId} templateId=${templateId}`
    );
    return;
  }

  const assignedBy = templateResult.Item.assignedBy?.S ?? 'scheduler';

  await Promise.all(
    childIds.map((childId) =>
      createAssignment({
        template: templateResult.Item!,
        childId,
        familyId,
        assignedBy,
      })
    )
  );
};

export { handleSchedulerEvent };
