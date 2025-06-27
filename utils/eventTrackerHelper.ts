import { Page, expect, Request } from '@playwright/test';
import { EVENT_ENDPOINT } from '../config/constants';

export class EventTrackerHelper {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

async waitForEvent(type: string) {
  return await this.page.waitForRequest((req) => {
    if (
      req.url().includes(EVENT_ENDPOINT) &&
      req.method() === 'POST'
    ) {
      const data = req.postData();
      if (!data) return false;

      try {
        const json = JSON.parse(data);
        return json.type === type;
      } catch (e) {
        console.warn(`Failed to parse POST data: ${data}`, e);
        return false;
      }
    }
    return false;
  });
}

  async extractPayload(request: Request): Promise<any> {
    return request.postDataJSON();
  }

  async assertBasicSchema(payload: any) {
    expect(payload).toHaveProperty('userId');
    expect(payload).toHaveProperty('type');
    expect(typeof payload.videoTime).toBe('number');
    expect(typeof payload.timestamp).toBe('string');
  }
}
