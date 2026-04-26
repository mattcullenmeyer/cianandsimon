import { Router } from 'express';
import { z } from 'zod';

import { AssignmentStatus, IANA_TIMEZONES } from '../constants';
import { requireFamilyAuth, requireKioskAuth } from '../middleware/auth';
import {
  completeAssignment,
  createAssignmentFromTemplate,
  getHistory,
  queryAssignmentsByStatus,
  updateAssignmentStatus,
  updateAssignmentSubtasks,
} from '../services/chore/assignments';
import { createSchedule } from '../services/chore/schedules';
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  listTemplates,
} from '../services/chore/templates';
import { handleSchedulerEvent } from '../scheduler-handler';

const router: Router = Router();

const createTemplateSchema = z.object({
  title: z.string().min(1),
  value: z.number().positive().multipleOf(0.01),
  subtasks: z.array(z.string().min(1)).optional(),
  expirationSeconds: z.number().int().positive().optional(),
  isVerificationRequired: z.boolean().optional().default(false),
  recurrence: z
    .object({
      rrule: z.string().min(1),
      childIds: z.array(z.string().min(1)).min(1),
      timezone: z.string().refine((tz) => IANA_TIMEZONES.has(tz), {
        message: 'Invalid timezone',
      }),
    })
    .optional(),
});

router.post('/template', requireFamilyAuth, async (req, res) => {
  const result = createTemplateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const {
    title,
    value,
    subtasks = [],
    expirationSeconds,
    recurrence,
    isVerificationRequired,
  } = result.data;
  const { parentId, familyId } = res.locals;

  const templateId = await createTemplate({
    familyId,
    parentId,
    title,
    value,
    subtasks,
    expirationSeconds,
    recurrence,
    isVerificationRequired,
  });

  if (recurrence && process.env.NODE_ENV === 'production') {
    try {
      await createSchedule({ templateId, recurrence, familyId });
    } catch (err) {
      await deleteTemplate({ familyId, templateId });
      throw err;
    }
  }

  res.status(201).json({ templateId });
});

const createAssignmentSchema = z.object({
  templateId: z.string().min(1),
  childId: z.string().min(1),
});

router.post('/assignment', requireFamilyAuth, async (req, res) => {
  const parsed = createAssignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }

  const { templateId, childId } = parsed.data;
  const { parentId, familyId } = res.locals;

  const result = await createAssignmentFromTemplate({
    familyId,
    templateId,
    childId,
    assignedBy: parentId,
  });

  if (!result.success) {
    if (result.reason === 'TEMPLATE_NOT_FOUND') {
      res.status(404).json({ error: 'Template not found' });
    } else {
      res.status(409).json({ error: 'Chore already assigned to this child' });
    }
    return;
  }

  res.status(201).json({ assignmentId: result.assignmentId });
});

// This route is only for testing purposes to trigger scheduled assignments manually in development
router.post(
  '/scheduled-assignment/:templateId',
  requireFamilyAuth,
  async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      res.status(404).end();
      return;
    }

    const { templateId } = req.params as { templateId: string };
    const { familyId } = res.locals;
    handleSchedulerEvent({ familyId, templateId });
    res.status(200).json({ message: 'Scheduled assignment triggered' });
  }
);

const updateAssignmentSubtasksSchema = z.object({
  subtasks: z.array(
    z.object({ label: z.string().min(1), completed: z.boolean() })
  ),
});

router.patch(
  '/assignment/:childId/:assignmentId/subtasks',
  requireKioskAuth,
  async (req, res) => {
    const result = updateAssignmentSubtasksSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.issues });
      return;
    }

    const { subtasks } = result.data;
    const { childId, assignmentId } = req.params as {
      childId: string;
      assignmentId: string;
    };
    const { familyId } = res.locals;

    await updateAssignmentSubtasks({
      familyId,
      childId,
      assignmentId,
      subtasks,
    });
    res.status(200).json({ assignmentId });
  }
);

const updateAssignmentStatusSchema = z.object({
  status: z.enum(AssignmentStatus),
});

router.patch(
  '/assignment/:childId/:assignmentId/status',
  requireKioskAuth,
  async (req, res) => {
    const result = updateAssignmentStatusSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.issues });
      return;
    }

    const { status } = result.data;
    const { childId, assignmentId } = req.params as {
      childId: string;
      assignmentId: string;
    };
    const { familyId } = res.locals;

    // TODO: technically we shouldn't allow this to be marked complete if it's just kiosk auth and verification is required
    if (status === 'COMPLETE') {
      const found = await completeAssignment({
        familyId,
        childId,
        assignmentId,
      });
      if (!found) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }
    } else {
      await updateAssignmentStatus({ familyId, childId, assignmentId, status });
    }

    res.status(200).json({ assignmentId, status });
  }
);

router.get('/assignments/active', requireKioskAuth, async (_req, res) => {
  const { familyId } = res.locals;
  const assignments = await queryAssignmentsByStatus({
    familyId,
    status: AssignmentStatus.ACTIVE,
  });
  res.status(200).json({ assignments });
});

router.get('/assignments/pending', requireFamilyAuth, async (_req, res) => {
  const { familyId } = res.locals;
  const assignments = await queryAssignmentsByStatus({
    familyId,
    status: AssignmentStatus.PENDING,
  });
  res.status(200).json({ assignments });
});

router.get('/history', requireFamilyAuth, async (req, res) => {
  const { familyId } = res.locals;
  const childId = req.query.childId as string | undefined;
  const history = await getHistory({ familyId, childId });
  res.status(200).json({ history });
});

router.get('/template/:templateId', requireFamilyAuth, async (req, res) => {
  const { familyId } = res.locals;
  const { templateId } = req.params as { templateId: string };

  const template = await getTemplate({ familyId, templateId });
  if (!template) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }

  res.status(200).json(template);
});

const listTemplatesSchema = z.object({
  type: z.enum(['scheduled', 'unscheduled']).optional(),
});

router.get('/templates', requireFamilyAuth, async (req, res) => {
  const result = listTemplatesSchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues });
    return;
  }
  const { familyId } = res.locals;
  const templates = await listTemplates({ familyId, type: result.data.type });
  res.status(200).json({ templates });
});

router.delete('/template/:templateId', requireFamilyAuth, async (req, res) => {
  const { familyId } = res.locals;
  const { templateId } = req.params as { templateId: string };

  const found = await deleteTemplate({ familyId, templateId });
  if (!found) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }

  res.status(204).end();
});

export default router;
