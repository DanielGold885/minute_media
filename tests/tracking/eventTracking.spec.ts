import { test, expect } from '@playwright/test';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { EventTrackerHelper } from '../../utils/eventTrackerHelper';
import { EVENT_TYPES, TEST_USER_ID } from '../../config/constants';
import { trackConsoleErrors } from '../../utils/consoleWatcher';

test.describe('Event Tracking Tests', () => {
  let playerPage: VideoPlayerPage;
  let eventTracker: EventTrackerHelper;
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = trackConsoleErrors(page);
    playerPage = new VideoPlayerPage(page);
    eventTracker = new EventTrackerHelper(page);
    await playerPage.goto();
  });

  test('A scroll should send scroll event with correct payload', async () => {
    const [request] = await Promise.all([
      eventTracker.waitForEvent(EVENT_TYPES.SCROLL),
      playerPage.scrollToElement(playerPage.scrollTarget),
    ]);

    const payload = await eventTracker.extractPayload(request);

    await eventTracker.assertBasicSchema(payload);
    expect(payload.userId).toBe(TEST_USER_ID);
    expect(payload.type).toBe(EVENT_TYPES.SCROLL);
  });

test('Playing the video should send a play event', async () => {
  const [request] = await Promise.all([
    eventTracker.waitForEvent(EVENT_TYPES.PLAY),
    playerPage.playVideo(),
  ]);

  const payload = await eventTracker.extractPayload(request);
  await eventTracker.assertBasicSchema(payload);
  expect(payload.type).toBe(EVENT_TYPES.PLAY);
  expect(payload.userId).toBe(TEST_USER_ID);
  expect(consoleErrors).toEqual([]);
});

test('Seeking should track seeked event correctly', async () => {
  const [request] = await Promise.all([
    eventTracker.waitForEvent(EVENT_TYPES.SEEKED),
    playerPage.seekTo(3),
  ]);

  const payload = await eventTracker.extractPayload(request);
  await eventTracker.assertBasicSchema(payload);

  expect(payload.type).toBe(EVENT_TYPES.SEEKED);
  expect(payload.userId).toBe(TEST_USER_ID);
  expect(payload.videoTime).toBe(3);
});

});
