export const IANA_TIMEZONES = new Set(Intl.supportedValuesOf('timeZone'));

export const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const SCHEDULER_EVENT_SOURCE = 'scheduler';

export enum AssignmentStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
}
