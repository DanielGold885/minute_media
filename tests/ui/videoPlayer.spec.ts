import { test, expect } from '@playwright/test';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { trackConsoleErrors } from '../../utils/consoleWatcher';

test.describe('Video Player UI Tests', () => {
  let playerPage: VideoPlayerPage;
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    playerPage = new VideoPlayerPage(page);
    consoleErrors = trackConsoleErrors(page);
    await playerPage.goto();
  });

  test('Player should play the video when play is triggered', async () => {
    await playerPage.playVideo();
    await expect(await playerPage.isPlaying()).toBe(true);
    expect(consoleErrors).toEqual([]);
  });

  test('Player should pause the video when pause is triggered', async () => {
    await playerPage.playVideo();
    await playerPage.pauseVideo();
    await expect(await playerPage.isPlaying()).toBe(false);
    expect(consoleErrors).toEqual([]);
  });

  test('Player should seek to a specific timestamp', async () => {
    const seekTo = 2;
    await playerPage.seekTo(seekTo);
    const currentTime = await playerPage.getCurrentVideoTime();
    expect(currentTime).toBe(seekTo);
    expect(consoleErrors).toEqual([]);
  });

  test('Player should scroll the page and trigger scroll event', async () => {
    await playerPage.scrollToElement(playerPage.scrollTarget);
    await expect(playerPage.scrollTarget).toBeVisible();
    expect(consoleErrors).toEqual([]); 
  });

});
