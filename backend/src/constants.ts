export const IANA_TIMEZONES = new Set(Intl.supportedValuesOf('timeZone'));

export const SCHEDULER_EVENT_SOURCE = 'scheduler';

export enum AssignmentStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
}
