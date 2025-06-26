import { Page, Locator } from '@playwright/test';

// --------------------
// Locator Constants
// --------------------
const VIDEO_SELECTOR = '#video';
const SCROLL_TARGET_SELECTOR = '#scroll-target';

export class VideoPlayerPage {
  readonly page: Page;
  readonly video: Locator;
  readonly scrollTarget: Locator;

  constructor(page: Page) {
    this.page = page;
    this.video = page.locator(VIDEO_SELECTOR);
    this.scrollTarget = page.locator(SCROLL_TARGET_SELECTOR);
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForSelector(VIDEO_SELECTOR);
    await this.page.waitForTimeout(1000); // fallback for video load
  }

  async playVideo() {
    await this.video.evaluate((video: HTMLVideoElement) => video.play());
  }

  async pauseVideo() {
    await this.video.evaluate((video: HTMLVideoElement) => video.pause());
  }

  async seekTo(seconds: number) {
    await this.video.evaluate((video: HTMLVideoElement, time: number) => {
      video.currentTime = time;
    }, seconds);
  }

  async scrollToElement(target: Locator) {
  await target.scrollIntoViewIfNeeded();
}

  async scrollPage() {
    await this.scrollTarget.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500); // allow scroll event to fire
  }

  async getCurrentVideoTime(): Promise<number> {
    return await this.video.evaluate((video: HTMLVideoElement) => video.currentTime);
  }

  async isPlaying(): Promise<boolean> {
    return await this.video.evaluate((video: HTMLVideoElement) => !video.paused);
  }
}
