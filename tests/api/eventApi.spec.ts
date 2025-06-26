import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiClient';
import { BASE_URL } from '../../config/constants';
import { validEventPayload } from '../../test_data/validEventPayload';
import { missingUserIdPayload } from '../../test_data/missingUserIdPayload';
import { invalidTypePayload } from '../../test_data/invalidTypePayload';


test.describe('POST /api/event - Positive', () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(BASE_URL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test('Return 200 for valid event payload', async () => {
    const response = await apiClient.postEvent(validEventPayload);

    expect(response.status()).toBe(200);

    const body = await response.text();
    console.log('✅ Response body:', body);
  });

test('Return 400 or fail for payload missing userId', async () => {
  const response = await apiClient.postEvent(missingUserIdPayload);

  expect(response.status()).not.toBe(200);

  const body = await response.text();
  console.log('❌ Response for missing userId:', body);
});

test('Return 400 or fail for invalid event type', async () => {
  const response = await apiClient.postEvent(invalidTypePayload);

  expect(response.status()).not.toBe(200);

  const body = await response.text();
  console.log('❌ Response for invalid event type:', body);
});
});
