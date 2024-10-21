import { SetMetadata } from '@nestjs/common';
import { Actions, Subjects } from '../constants';

export const CAPABILITY_KEY = 'requiredCapabilities';
export const SUBJECT_KEY = 'setSubject';

export const RequiredCapability = (...capabilities: Actions[]) =>
  SetMetadata(CAPABILITY_KEY, capabilities);

export const Subject = (subject: Subjects) => SetMetadata(SUBJECT_KEY, subject);
