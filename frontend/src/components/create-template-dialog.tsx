import { useState } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { Portal } from '@ark-ui/react/portal';
import { Button, Dialog } from '@/components/ui';
import {
  TemplateBase,
  TemplateAssignments,
  TemplateChecklist,
  TemplateSchedule,
} from '@/components/template-dialog';

const homeRoute = getRouteApi('/home');

export type View = 'base' | 'assignments' | 'checklist' | 'schedule';

export interface CreateTemplatePayload {
  title: string;
  value: number;
  subtasks: string[];
  expirationSeconds?: number;
  isVerificationRequired?: boolean;
  recurrence?: {
    rrule: string;
    childIds: string[];
    timezone: string;
  };
}

const defaultPayload: CreateTemplatePayload = {
  title: '',
  value: 0,
  subtasks: [],
  isVerificationRequired: false,
};

export const CreateTemplateDialog = () => {
  const { children } = homeRoute.useLoaderData();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('base');
  const [payload, setPayload] = useState<CreateTemplatePayload>(defaultPayload);
  const [assignedChildIds, setAssignedChildIds] = useState<string[]>([]);

  const onChangeView = (newView: View) => {
    setView(newView);
  };

  const onChangeTitle = (title: string) => {
    setPayload((prev) => ({ ...prev, title }));
  };

  const onChangeValue = (value: number) => {
    setPayload((prev) => ({ ...prev, value }));
  };

  const onChangeChildIds = (childIds: string[]) => {
    setAssignedChildIds(childIds);
  };

  const onAddSubtask = (label: string) => {
    setPayload((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks ?? []), label],
    }));
  };

  const onRemoveSubtask = (index: number) => {
    setPayload((prev) => ({
      ...prev,
      subtasks: (prev.subtasks ?? []).filter((_, i) => i !== index),
    }));
  };

  const onUpdateSubtask = ({
    index,
    label,
  }: {
    index: number;
    label: string;
  }) => {
    setPayload((prev) => {
      const subtasks = [...(prev.subtasks ?? [])];
      subtasks[index] = label;
      return { ...prev, subtasks };
    });
  };

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async () => {
    console.log('submit', payload);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size="full"
      motionPreset="slide-in-right"
    >
      <Dialog.Trigger asChild>
        <Button
          width="full"
          justifyContent="center"
          css={{ '--btn-bg': '{colors.green.primary}' }}
        >
          CREATE CHORE
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {view === 'base' && (
              <TemplateBase
                title={payload.title}
                value={payload.value}
                assignedChildCount={assignedChildIds.length}
                subtaskCount={payload.subtasks?.length ?? 0}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                onChangeView={onChangeView}
                onChangeTitle={onChangeTitle}
                onChangeValue={onChangeValue}
              />
            )}

            {view === 'assignments' && (
              <TemplateAssignments
                children={children}
                childIds={assignedChildIds}
                onChangeChildIds={onChangeChildIds}
                onClickBack={() => onChangeView('base')}
              />
            )}

            {view === 'checklist' && (
              <TemplateChecklist
                subtasks={payload.subtasks ?? []}
                onAddSubtask={onAddSubtask}
                onRemoveSubtask={onRemoveSubtask}
                onUpdateSubtask={onUpdateSubtask}
                onClickBack={() => onChangeView('base')}
              />
            )}

            {view === 'schedule' && (
              <TemplateSchedule onClickBack={() => onChangeView('base')} />
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
