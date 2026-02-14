// https://github.com/chakra-ui/ark/tree/main/packages/react/src/components/timer

'use client';
import { Timer } from '@ark-ui/react/timer';
import type { ComponentProps } from 'react';
import { createStyleContext } from 'styled-system/jsx';
import { timer } from 'styled-system/recipes';

const { withProvider, withContext } = createStyleContext(timer);

export type RootProps = ComponentProps<typeof Root>;
export const Root = withProvider(Timer.Root, 'root');
export const Area = withContext(Timer.Area, 'area');
export const Control = withContext(Timer.Control, 'control');
export const Item = withContext(Timer.Item, 'item');
export const ActionTrigger = withContext(Timer.ActionTrigger, 'actionTrigger');
export const Separator = withContext(Timer.Separator, 'separator');
