# Weather Comfort Analytics — Agent Instructions

## 1. Project Goal

Build a secure weather analytics web application that:

- Reads city codes from `cities.json`.
- Fetches weather data from OpenWeatherMap.
- Calculates a custom Comfort Index.
- Scores each city from `0–100`.
- Ranks cities from most comfortable to least comfortable.
- Shows weather data and the score.
- Uses server-side caching.
- Supports mobile and desktop.
- Uses Auth0 authentication and authorization.
- Runs in Docker.
- Includes automated testing and CI.

The backend must calculate the Comfort Index. Never calculate it only on the frontend.

The application must process at least 10 cities.

---

## 2. Required Stack

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Auth0
- Redis
- OpenWeatherMap
- Zod
- Vitest
- React Testing Library
- Playwright
- Docker
- GitHub Actions

Use TypeScript throughout the application.

Do not add unnecessary technologies.

Do not introduce a separate backend unless there is a clear requirement that Next.js cannot satisfy.

---

# 3. Design Plan

## Color

Use an overcast palette because the scoring model rewards grey, cloudy weather.

```text
Background / Mist:  #EAEBE6
Text / Ink:         #1E2421
Secondary / Slate:  #6B746D
High Comfort:       #3E6B5A
Moderate:           #A98B3E
Low Comfort:        #B0572E
```

Do not use sunny yellows.

Do not use glassy blues.

The palette should reinforce the application's overcast-weather concept.

---

## Typography

Use:

```text
IBM Plex Sans
IBM Plex Mono
```

Use IBM Plex Sans for normal UI text.

Use IBM Plex Mono for numerical data, including:

- Temperature.
- Comfort scores.
- Weights.
- Ranking values.
- Other important numerical values.

Keep both fonts within the same family so the interface feels consistent.

Monospace numbers should also improve alignment when scanning rankings.

---

## Layout

The main visual element is a semicircular Comfort Index gauge.

The gauge should resemble a barometer face:

- Arc.
- Ticks.
- Needle.
- Large score.

Use the gauge for the **#1 ranked city** as the main hero element.

Below it, show the ranked city list.

Each ranking row should contain:

- Rank.
- City.
- Temperature.
- Comfort score.
- Weather description.

Rank numbers represent the actual ranking sequence.

Rows should expand when tapped/clicked to show:

- Temperature score.
- Humidity score.
- Wind score.
- Cloudiness score.
- Overall Comfort Index.

The UI must work on both desktop and mobile.

---

## Meaning

Place the Comfort Index weight legend directly below the main headline.

Show:

```text
45% Temperature
25% Humidity
15% Wind
15% Cloudiness
```

Also show a short plain-language explanation of the model:

> Rewards cool, calm, overcast — not just low temperatures.

The interface should explain the model's bias before the user examines individual cities.

---

## Sample Ranking

The initial design should use the real Comfort Index formula against 10 sample cities.

The displayed ranking must come from the actual algorithm.

The expected sample behavior is:

```text
Dublin      → high
Bergen      → high
Vancouver   → high
Reykjavík   → middle
Phoenix     → low
Dubai       → low
```

Dublin should edge out Bergen and Vancouver.

Reykjavík should not automatically rank first just because it is very cloudy. Its low temperature should reduce its score.

Phoenix and Dubai should rank poorly because they are hot, dry, and have little cloud coverage.

Do not hardcode these rankings.

The algorithm must produce them naturally from the weather data.

---

# 4. Comfort Index

The Comfort Index must return a number from `0–100`.

Use these four primary parameters:

| Parameter | Weight |
|---|---:|
| Temperature | 45% |
| Humidity | 25% |
| Wind Speed | 15% |
| Cloudiness | 15% |

Formula:

```text
Score =
100 × (
  0.45 × TemperatureScore +
  0.25 × HumidityScore +
  0.15 × WindScore +
  0.15 × CloudinessScore
)
```

Each parameter must first be converted to a `0–1` comfort score.

Clamp the final result to `0–100`.

Round the final score to an integer.

---

## 5. Comfort Definition

The Comfort Index should represent:

- Cool weather.
- Cold but not freezing.
- Low or moderate humidity.
- Noticeable but light/moderate wind.
- High cloud coverage.
- Normal visibility.
- Normal atmospheric pressure.

Do not treat lower temperature as automatically better.

Temperature should have a preferred cool range. Very cold and very hot conditions should reduce the score.

Do not treat zero wind as automatically ideal. Light, noticeable wind should score higher.

High cloud coverage should generally increase comfort.

Humidity should reduce comfort as it becomes excessive.

Pressure is not important to this model.

Visibility is not part of the initial formula.

---

## 6. Comfort Algorithm

Use separate functions for each parameter:

```text
temperatureScore()
humidityScore()
windScore()
cloudinessScore()
```

Then combine them with the weighted formula.

Use piecewise scoring rather than directly weighting raw weather values.

Do not use machine learning.

Do not use arbitrary raw-value addition.

The algorithm must be deterministic and easy to explain.

---

## 7. Future Comfort Index Extension

Keep the algorithm easy to extend.

Visibility should be available in the weather data but excluded from the initial weighted formula.

The code must make it easy to add Visibility later.

The required screen recording includes a live change where one additional parameter is added to the formula.

Use Visibility as the preferred live extension.

---

## 8. Weather Data

Read city IDs from:

```text
cities.json
```

Use OpenWeatherMap's weather API.

Keep the OpenWeatherMap API key on the server.

Never expose the API key to the browser.

Validate external API responses before using them.

Handle:

- API errors.
- Invalid responses.
- Missing fields.
- Network failures.
- Rate limits.

Do not allow one failed city request to break the entire dashboard.

---

## 9. Caching

Use Next.js/Vercel server-side Data Cache.

Do not use Redis.

Cache raw weather responses for:

```text
300 seconds
```

Cache processed Comfort Index results separately.

Use city-specific cache keys, for example:

```text
weather:{cityId}
comfort:{cityId}
```

Request flow:

```text
Check Comfort cache
    ↓
HIT → return cached result

MISS
    ↓
Check Weather cache
    ↓
HIT → calculate Comfort Index → cache result → return

MISS
    ↓
Fetch OpenWeatherMap
    ↓
Cache raw weather
    ↓
Calculate Comfort Index
    ↓
Cache processed result
    ↓
Return result
```

Add a protected debug endpoint that reports cache status.

It must show whether relevant data was:

```text
HIT
MISS
```

and preferably show remaining TTL.

---

## 10. Authentication

Use Auth0.

Only authenticated users can access the dashboard.

Implement:

- Login.
- Logout.
- Email verification.
- Email MFA.
- Restricted signups.
- Whitelisted users.

Do not rely on frontend checks for authorization.

Protect dashboard and API endpoints on the server.

Never expose secrets in client-side code.

---

## 11. API Design

Keep API routes simple.

Suggested routes:

```text
GET /api/weather
GET /api/rankings
GET /api/cache/status
```

All protected API routes must require authentication.

The API should return structured data containing:

- City name.
- Weather description.
- Temperature.
- Comfort score.
- Rank.
- Relevant weather values.

---

## 12. Frontend

The UI must support:

- Desktop.
- Tablet.
- Mobile.

Show cities ranked from most comfortable to least comfortable.

Each city should show:

- City name.
- Weather description.
- Temperature.
- Comfort score.
- Rank.

Show the Comfort Index breakdown when a city row is expanded:

```text
Temperature
Humidity
Wind
Cloudiness
Total
```

Keep the interface simple.

Do not build unnecessary dashboard features.

Follow the design plan in Section 3.

---

## 13. Testing

Write unit tests for the Comfort Index.

Test:

- Normal comfortable weather.
- Very cold weather.
- Very hot weather.
- High humidity.
- Low humidity.
- No wind.
- Moderate wind.
- Strong wind.
- Clear weather.
- Cloudy weather.
- Score boundaries.
- Final score between `0–100`.

Test API behavior.

Test cache HIT and MISS behavior.

Test authentication protection.

Use Playwright for important end-to-end flows.

Test the responsive UI.

Test that ranking is generated by the Comfort Index and is not hardcoded.

---

## 14. Project Structure

Prefer:

```text
src/
├── app/
│   ├── dashboard/
│   └── api/
│       ├── weather/
│       ├── rankings/
│       └── cache/
├── components/
├── lib/
│   ├── auth/
│   ├── weather/
│   ├── cache/
│   └── comfort/
│       ├── index.ts
│       ├── temperature.ts
│       ├── humidity.ts
│       ├── wind.ts
│       └── cloudiness.ts
├── types/
└── data/
    └── cities.json

tests/
├── unit/
├── integration/
└── e2e/
```

Keep business logic separate from UI components.

Keep the Comfort Index calculation independent and testable.

---

## 15. Docker

Provide a production-ready Dockerfile.

Prefer a multi-stage build.

Do not include development dependencies in the final production image when unnecessary.

Do not place secrets inside the Dockerfile.

Use environment variables for:

```text
OpenWeatherMap API key
Auth0 configuration
Redis configuration
```

---

## 16. CI

Use GitHub Actions.

CI should run:

```text
Install dependencies
↓
Lint
↓
Type check
↓
Unit tests
↓
Integration tests
↓
Build
↓
Docker build
```

Do not allow broken tests or type errors to pass CI.

---

## 17. Code Quality

Use:

- TypeScript strict mode.
- ESLint.
- Clear function names.
- Small functions.
- Strong types.
- Server/client separation.
- Environment variables for secrets.

Do not duplicate Comfort Index logic.

Do not put business logic directly inside React components.

Do not expose private server configuration to the browser.

---

## 18. Security

Never expose:

- OpenWeatherMap API keys.
- Redis credentials.
- Auth0 secrets.
- Other server secrets.

Keep external API calls on the server.

Validate user input.

Validate external API responses.

Protect API routes with Auth0.

Do not trust client-provided Comfort Index scores.

Always calculate the score on the server.

---

## 19. README

The README must include:

- Setup instructions.
- Required environment variables.
- Stack explanation.
- Comfort Index formula.
- Parameter weights.
- Reasoning for each weight.
- Algorithm trade-offs.
- Cache design.
- Authentication design.
- Known limitations.
- Testing instructions.
- Docker instructions.

The README must explain the Comfort Index clearly enough that another developer can understand and modify it.

---

## 20. Screen Recording Requirements

The final recording must be:

- One continuous recording.
- Unedited.
- 5–7 minutes.
- Voice must be audible.

Explain one major design decision.

Prefer explaining the Comfort Index or caching design.

Then live-add one additional Comfort Index parameter.

Preferred extension:

```text
Visibility
```

Recalculate the scores and show that the city ranking changes correctly.

Do not prepare the code change beforehand.

The implementation must be easy enough to modify live.

---

## 21. Development Priority

Implement in this order:

```text
1. Project setup
2. cities.json loading
3. OpenWeatherMap integration
4. Weather data validation
5. Comfort Index
6. City ranking
7. Redis caching
8. API endpoints
9. Auth0
10. Responsive UI
11. Apply final visual design
12. Tests
13. Docker
14. CI
15. README
16. Screen-recording preparation
```

Do not build the full UI before the backend data and Comfort Index are working.

Do not add optional features until all required features work.

---

## 22. Do Not Over-Engineer

Do not add:

- Microservices.
- Kubernetes.
- Kafka.
- RabbitMQ.
- GraphQL.
- Machine learning.
- PostgreSQL unless a real requirement appears.
- Extra infrastructure without a clear purpose.

Prefer the simplest design that satisfies the assignment.

---

## 23. Core Design Principle

The application should be:

```text
Simple
Secure
Testable
Explainable
Responsive
Easy to modify
Visually consistent with the comfort model
```

The Comfort Index is the main custom engineering decision.

Keep it transparent enough that its behavior can be explained and changed during the interview.

The visual design must communicate the same idea as the algorithm: **cool, overcast weather is comfortable; simply being cold is not enough.**