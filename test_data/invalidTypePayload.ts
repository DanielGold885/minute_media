import { TEST_USER_ID } from '../config/constants';

export const invalidTypePayload = {
  userId: TEST_USER_ID,
  type: 'invalid-event', // Not in EVENT_TYPES
  videoTime: 5.2,
  timestamp: new Date().toISOString(),
};
