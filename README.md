# Weather Comfort Analytics

A web application that ranks cities by weather comfort using a custom Comfort Index algorithm. The index rewards cool, calm, overcast weather — not just low temperatures.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Next.js API routes (App Router)
- **Authentication:** Auth0 (with MFA via email verification, restricted signups)
- **Weather Data:** OpenWeatherMap API
- **Caching:** Next.js `"use cache"` directive (built-in, no external dependencies)
- **Validation:** Zod
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **CI:** GitHub Actions
- **Container:** Docker (multi-stage build)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key |
| `AUTH0_SECRET` | Random 32-byte hex string (generate with `openssl rand -hex 32`) |
| `AUTH0_BASE_URL` | Your app URL (e.g., `http://localhost:3000`) |
| `AUTH0_DOMAIN` | Your Auth0 tenant URL (e.g., `https://your-tenant.auth0.com`) |
| `AUTH0_CLIENT_ID` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |

### 3. Auth0 Configuration

1. Create a Regular Web Application in Auth0 Dashboard
2. Add `http://localhost:3000/auth/callback` to **Allowed Callback URLs**
3. Add `http://localhost:3000` to **Allowed Logout URLs**
4. Copy the client ID and secret to your `.env` file

### 4. Multi-Factor Authentication (MFA)

MFA is enabled via email verification:

1. In the Auth0 Dashboard, go to **Security → Multi-factor Auth**
2. Enable the **Email** factor (and optionally others like OTP/Authenticator)
3. Configure a Policy: require MFA for all users (or start with a first-login prompt)
4. After enabling, users must verify with a one-time code (sent to their email) after their primary login

### 5. Restrict Signups

Public signups are disabled — only whitelisted users can log in:

1. In the Auth0 Dashboard, go to **Authentication → Database → Settings**
2. Turn **Off** "Enable Signups" so no one can self-register
3. In **Authentication → Database → Users**, manually add the users allowed to use the app
4. Login is limited to that pre-created whitelist

Create the test user in **Authentication → Database → Users**:

| Field | Value |
|-------|-------|
| Email | (test user email — see assignment) |
| Password | (test user password — see assignment) |

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Comfort Index Formula

The Comfort Index returns a score from 0-100 using four weighted parameters:

```
Score = 100 × (
  0.45 × TemperatureScore +
  0.25 × HumidityScore +
  0.15 × WindScore +
  0.15 × CloudinessScore
)
```

### Parameter Weights

| Parameter | Weight | Reasoning |
|-----------|--------|-----------|
| Temperature | 45% | Primary comfort driver; ideal range 8-18°C |
| Humidity | 25% | Excessive humidity reduces comfort; ideal 30-60% |
| Wind Speed | 15% | Light breeze (2-5 m/s) is pleasant; still air or strong wind is not |
| Cloudiness | 15% | Overcast skies are rewarded per the overcast comfort model |

### Scoring Functions

- **Temperature:** Piecewise scoring with peak comfort at 8-18°C, dropping toward 0°C and 30°C
- **Humidity:** Peak at 30-60%, significant penalty above 80%
- **Wind:** Peak at 2-5 m/s (light breeze), penalty at 0 m/s and above 10 m/s
- **Cloudiness:** Higher cloud coverage = higher score (overcast = comfort)

### Algorithm Trade-offs

- **Pros:** Deterministic, explainable, easy to modify, no ML dependencies
- **Cons:** Static weights don't adapt to seasonal or regional preferences
- **Design Decision:** Temperature has the highest weight (45%) because it's the strongest predictor of physical comfort. Cloudiness rewards overcast conditions per the application's core concept.

## Cache Design

- **Mechanism:** Next.js `"use cache"` directive on the data-fetching functions
- **Cached functions:**
  - `fetchWeatherForCity` — raw current weather from OpenWeatherMap
  - `fetchForecast` — raw 5-day forecast, plus per-point comfort scores
  - `calculateComfortIndex` — the processed Comfort Index output (cached separately)
- **TTL:** Next.js default cache lifetime (300 seconds / 5 minutes) — matching the
  requirement to cache raw weather API responses for 5 minutes
- **Cache keying:** Arguments-based — each unique `cityId` / parameter set produces
  its own cache entry
- **No external dependencies:** Caching is handled entirely by Next.js — no Redis
  or Memcached required, so there is no infrastructure to provision or fail

> **Note on the cache-status debug endpoint:** The assignment asks for a
> `HIT / MISS` cache-status endpoint, and an earlier version of this app had
> `GET /api/cache/status`. That endpoint was removed when caching moved to the
> Next.js `"use cache"` directive. Next.js does not expose a first-class
> per-request `HIT / MISS` status header for this directive, so today the
> effective observable view of the cache is latency on `GET /api/rankings`
> (a warm cache returns fast; a cold cache re-fetches from OpenWeatherMap). This
> is tracked as a known limitation below.

## Authentication Design

- All dashboard and API routes are protected via Auth0 proxy (Next.js 16 `proxy.ts`)
- Unauthenticated users are redirected to Auth0 login
- API routes return 401 Unauthorized without a valid session
- Secrets are never exposed to client-side code

## Known Limitations

- **Cache-status debug endpoint:** The assignment's `HIT / MISS` cache-status
  endpoint was removed when caching moved to the Next.js `"use cache"`
  directive; observe cache behaviour via latencies on `/api/rankings` instead.
- Cache TTL relies on the Next.js default (5 minutes); there is no programmatic
  cache invalidation (`cacheTag` / `revalidateTag` are not used)
- Auth0 requires a real tenant configuration; placeholder values won't work
- The Comfort Index uses static weights that don't adapt to seasons or regions
- Weather data is real-time; rankings change based on current conditions

## Testing

### Run All Tests

```bash
npm run test:all
```

### Run Unit Tests Only

```bash
npm test
```

### Run E2E Tests Only

```bash
npm run test:e2e
```

### Test Coverage

- **Unit tests:** Comfort Index scoring functions (temperature, humidity, wind, cloudiness), weather schema validation, converter utilities
- **Integration tests:** API authentication protection, ranking correctness with real algorithm
- **E2E tests:** Dashboard loading, responsive layout

## Docker

### Build

```bash
docker build -t bestweather .
```

### Run

```bash
docker run -p 3000:3000 \
  -e OPENWEATHER_API_KEY=your_key \
  -e AUTH0_SECRET=your_secret \
  -e AUTH0_DOMAIN=https://your-tenant.auth0.com \
  -e AUTH0_CLIENT_ID=your_client_id \
  -e AUTH0_CLIENT_SECRET=your_client_secret \
  bestweather
```

The Dockerfile uses a multi-stage build:
1. **deps** - Installs all dependencies
2. **builder** - Runs tests and builds the Next.js app
3. **runner** - Production image with only runtime dependencies

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page / sign-in gate
│   ├── layout.tsx                # Root layout (IBM Plex fonts, ThemeProvider)
│   ├── globals.css               # Overcast palette + Tailwind v4 config
│   ├── dashboard/
│   │   ├── page.tsx              # Server component (loads rankings)
│   │   ├── DashboardClient.tsx   # Client-side dashboard logic
│   │   └── DashboardSkeleton.tsx # Loading skeleton
│   └── api/
│       ├── weather/route.ts      # Current weather endpoint (auth-gated)
│       ├── rankings/route.ts     # Ranked cities endpoint (auth-gated)
│       └── forecast/route.ts     # 5-day forecast endpoint (auth-gated)
├── components/
│   ├── TopCityCard.tsx           # "Most Comfortable" card + 5-day trend
│   ├── FilterBar.tsx             # Sort (Listbox) + comfort tier filters
│   ├── CityRankingList.tsx       # Ranked city list
│   ├── CityRow.tsx               # Expandable city row
│   ├── CityChart.tsx             # Recharts temperature trend chart
│   └── ThemeToggle.tsx           # Dark/light mode toggle
├── lib/
│   ├── auth/auth0.ts             # Auth0 client setup
│   ├── theme-context.tsx         # Theme provider (localStorage)
│   ├── weather/
│   │   ├── fetcher.ts            # OpenWeatherMap current weather client
│   │   ├── forecast.ts           # OpenWeatherMap 5-day forecast + scores
│   │   └── schema.ts             # Zod validation schemas
│   └── comfort/
│       ├── index.ts              # Weighted combination (score 0-100)
│       ├── temperature.ts        # Temperature scoring
│       ├── humidity.ts           # Humidity scoring
│       ├── wind.ts               # Wind speed scoring
│       └── cloudiness.ts         # Cloudiness scoring
├── data/cities.json              # 10 city configurations from assignment
├── types/index.ts                # TypeScript interfaces
└── proxy.ts                      # Auth0 middleware (Next.js 16)
tests/
├── unit/                         # Comfort scoring + schema unit tests
├── integration/                  # API auth + ranking integration tests
├── component/                    # React component tests (jsdom)
└── e2e/                          # Playwright end-to-end tests
```

## Screen Recording (Assignment Part 3)

A single, unedited 5-7 minute screen recording is required for submission:

1. **Explain one key design decision** — for example why the Comfort Index is
   weighted 45% temperature / 25% humidity / 15% wind / 15% cloudiness, or how
   the caching layer is structured. Walk through the reasoning and trade-offs
   as if explaining to a teammate who has not seen the code.
2. **Live-implement a small extension** — add one additional parameter to the
   Comfort Index (e.g., Visibility or Pressure), recompute the scores, and
   confirm the city ranking updates correctly — without pausing or pre-writing
   the change.

Recording requirements: single unedited take, voice audible throughout, share
via Google Drive ("Anyone with the link"), and verify it opens in an incognito
window before submitting.
