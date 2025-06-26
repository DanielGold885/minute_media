import { EVENT_TYPES } from '../config/constants';

export const missingUserIdPayload = {
  // userId is intentionally missing
  type: EVENT_TYPES.PLAY,
  videoTime: 12.3,
  timestamp: new Date().toISOString(),
};
