import { TEST_USER_ID, EVENT_TYPES } from '../config/constants';

export const validEventPayload = {
  userId: TEST_USER_ID,
  type: EVENT_TYPES.PLAY,
  videoTime: 10.5,
  timestamp: new Date().toISOString(),
};
