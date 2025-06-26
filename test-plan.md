# Test Plan

## 1. Overview

This test plan outlines the strategy for verifying the functionality, reliability, and event tracking of the MyPlayer Web Client — a frontend video player application that logs user interactions (e.g., play, pause, seek, scroll) and sends them to a backend analytics endpoint.

The primary goals are to ensure:

- Core video player controls function correctly on supported browsers (Chrome and Firefox).
- User interactions are accurately tracked and sent to the backend in the correct JSON format.
- The backend API behaves as expected under both valid and invalid input conditions.
- The system is resilient to common failures (e.g., backend component downtime, malformed payloads, slow network).
- No critical frontend errors or crashes occur during normal use.
- No unexpected network errors during normal use.
- Basic security principles are followed, such as rejecting invalid input on the backend and avoiding exposure of sensitive information in logs or event payloads.
- Automation is stable, maintainable, and integrated into a CI pipeline for continuous testing and reporting.

## 2. Scope

### In Scope

The following areas are covered by this test plan:

- **Functional UI Testing**
  - Playback controls: Play, Pause, Seek
  - Scroll interaction on page
  - Exploratory testing - trying to tackle the feature as a real user

- **Event Tracking Validation**
  - Ensure correct event types (`play`, `pause`, `seeked`, `scroll`) are sent
  - Validate JSON structure, `videoTime`, and ISO timestamps
  - Ensure `POST /api/event` is triggered with expected payload

- **API Testing**
  - Positive: Valid JSON POST requests to `/api/event`
  - Negative: Missing fields, wrong data types, malformed payloads
  - Backend resilience: Behavior when backend is unreachable

- **Cross-browser Testing**
  - Basic smoke tests on Chrome and Firefox (desktop only)

- **Resilience & Security**
  - Test behavior under backend failure (simulate network loss or 500 error)
  - Ensure no sensitive info is exposed in the request or logs
  - Confirm graceful handling of unexpected values or events

- **CI & Reporting**
  - All tests run automatically via GitHub Actions
  - Test results exported in HTML/JUnit format
  - Failures include logs and screenshots
  
- **Additional Aspects**
  - Making sure that unit and integration testing was performed by dev
  - Examining if and which sensors are needed / were added after deployment to make sure critical components are up and running
  - Examining if and which statistics are needed and should be added to track user activities

### Out of Scope

- Mobile browser support
- Accessibility, compliance
- Load testing or concurrency testing
- Video content verification (e.g., frame accuracy or visual quality)


## 3. Automation Strategy

The automation focuses on two main layers:

### UI Automation
- Simulate user interactions with the video player (Play, Pause, Seek, Scroll)
- Verify that each interaction triggers the expected event
- Validate network requests to `/api/event` using request interception
- Tool: Playwright

### API Automation
- Send direct POST requests to `/api/event`
- Cover both positive and negative scenarios (e.g., missing fields, invalid data types)
- Validate response codes and error handling
- Tool: Playwright request API or an HTTP client (e.g., Axios)

## 4. Tools & Technologies

### UI & API Automation
- **Tool**: [Playwright](https://playwright.dev/) with **TypeScript**
- **Why**:
  - Supports both UI and API testing in a single framework
  - Cross-browser support out of the box (Chrome & Firefox)
  - Easy request interception for validating event tracking
  - Clear syntax, great developer experience
  - Short ramp-up time for frontend developers who may extend test coverage in the future
  - A lot of "out of the box" features that are great for testing the player
  - Stable and well maintained open source with a large and growing comminity

### Manual API Testing
- **Tool**: [Postman](https://www.postman.com/)
- **Why**:
  - Quick to test backend `/api/event` with various payloads
  - Useful for exploratory testing and validating error handling
  - Easy to share or document sample requests/responses

### Continuous Integration
- **Tool**: GitHub Actions
- **Why**:
  - Easy to set up and integrates well with GitHub
  - Supports running tests, collecting artifacts (logs, screenshots, reports), and PR commenting

### Reporting
- **Tool**: Playwright HTML Reporter (built-in)
- **Why**:
  - No setup required
  - Provides clean test reports with test names, status, logs, and screenshots on failure


## 5. Test Scenarios

### 5.1 UI Test Scenarios

| ID | Description | Type | Expected Result |
|----|-------------|------|-----------------|
| UI-01 | Play video from start | Functional | Video starts playing, no buffering, "play" event sent |
| UI-02 | Pause video mid-play | Functional | Video pauses, "pause" event sent |
| UI-03 | Seek to a specific time (e.g., 30s) | Functional | Video jumps, "seeked" event sent |
| UI-04 | Scroll down the page | Functional | "scroll" event sent |
| UI-06 | Seek to end of video | Edge | "seeked" event with final timestamp sent |
| UI-07 | Try to play when network is offline | Resilience | Player UI handles gracefully, no crash |
| UI-08 | Perform all actions quickly in sequence | Exploratory | System tracks all events correctly, no frontend errors |


### 5.2 Event Tracking Scenarios

| ID | Description | Type | Expected Result |
|----|-------------|------|-----------------|
| EV-01 | "play" event is sent when video starts playing | Functional | POST request to `/api/event` with type: "play" and valid payload |
| EV-02 | "pause" event is sent when video is paused | Functional | POST request with type: "pause", includes current `videoTime` |
| EV-03 | "seeked" event is sent when user seeks | Functional | POST request with type: "seeked", reflects new `videoTime` |
| EV-04 | "scroll" event is sent when page is scrolled | Functional | POST request with type: "scroll", timestamp recorded |
| EV-05 | JSON structure includes userId, type, videoTime, timestamp | Validation | All keys present and values are in correct format |
| EV-06 | Timestamps are ISO 8601 formatted | Validation | Format: `YYYY-MM-DDTHH:mm:ss.sssZ` |
| EV-07 | Event is sent immediately after user interaction | Timing | Event POST appears within 1s of UI action |
| EV-08 | No duplicate events sent for single user action | Edge | Only one event logged for each discrete interaction |
| EV-09 | Invalid event types are rejected by backend | Negative | Backend returns 400 or ignores unknown types |

### 5.4 Security Test Scenarios

| ID | Description | Type | Expected Result |
|----|-------------|------|-----------------|
| SEC-01 | Payload contains unexpected fields (e.g., `isAdmin: true`) | Input Hardening | Backend ignores unrecognized fields |
| SEC-02 | Attempt XSS via `userId` or `type` field | Input Sanitization | Backend logs raw string, no code executed |
| SEC-03 | Submit payload with large JSON body (e.g., 10MB+) | Input Size | Backend handles or rejects safely |
| SEC-04 | Verify that `userId` is not exposed in logs or error traces | Data Privacy | No sensitive fields in console or debug output |
| SEC-05 | Send repeated malformed requests to simulate abuse | Rate/Abuse Resilience | Backend remains stable; no crash or flood log |

## 6. Manual vs. Automated Testing Split

### Automated Tests

The following areas will be covered by automated tests using Playwright (UI + API):

- Core UI functionality (Play, Pause, Seek, Scroll)
- Event tracking validation through network request interception
- Backend `/api/event` endpoint: positive and negative scenarios
- Resilience tests: backend unavailable, malformed input
- Event payload structure, including schema and timestamp format


### Manual Tests

Manual testing will be used in the following cases:

- Exploratory UI testing (simulating real user behavior sequences)
- Postman-based manual testing of the API for quick iteration and ad hoc validation
- UI layout, responsiveness, and visual behavior (outside the scope of automated checks)
- Observing real-time logs and behavior when testing backend unavailability
- Monitoring network behavior in devtools during high-frequency user interactions


The overall strategy prioritizes automation for deterministic, repeatable cases while reserving manual effort for visual validation, exploratory testing, and areas requiring human observation or system-level coordination (Like during development or pre major release).


