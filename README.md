# Minute Media Automation Project

This project includes UI and API automation tests for the Minute Media video player, built with **Playwright** and **TypeScript**.

## 🔧 Prerequisites

- Node.js (v18+)
- npm
- Docker & Docker Compose (for running the app locally)

## 🚀 Run the Application Locally

```bash
docker-compose up --build
```

The app will be available at: http://localhost:3000


## 🧪 Run Tests

UI + Event Tracking Tests

```bash
npx playwright test tests/ui
npx playwright test tests/tracking
```

API Tests

```bash
npx playwright test tests/api
```

## 📊 View Test Report
After running tests, open the Playwright report:

```bash
npx playwright show-report
```

## 📁 Project Structure

```markdown
tests/
  ├── ui/          # UI tests for video player
  ├── tracking/    # Event tracking validation
  ├── api/         # API tests for /api/event
pages/             # Page object models
utils/             # Helpers (e.g., event tracker, API client)
config/            # Constants and configuration
test_data/         # Reusable payloads
```