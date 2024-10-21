import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'requiredCapabilities';
export const SUBJECT_KEY = 'setSubject';

export const RequiredCapability = (...capabilities: string[]) =>
  SetMetadata(ROLES_KEY, capabilities);

export const Subject = (subject: string) => SetMetadata(SUBJECT_KEY, subject);
