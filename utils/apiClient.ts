import { APIRequestContext, request } from '@playwright/test';
import { BASE_URL } from '../config/constants';


export class ApiClient {
private context?: APIRequestContext;
private readonly baseUrl: string;

  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async init() {
    this.context = await request.newContext();
  }

async postEvent(payload: Record<string, any>) {
  if (!this.context) {
    throw new Error('API client not initialized. Call init() before making requests.');
  }

  return await this.context.post(`${this.baseUrl}/api/event`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


async dispose() {
  if (this.context) {
    await this.context.dispose();
  }
}
}
