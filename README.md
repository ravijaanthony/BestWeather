# Weather Comfort Analytics

A web application that ranks cities by weather comfort using a custom Comfort Index algorithm. The index rewards cool, calm, overcast weather — not just low temperatures.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Next.js API routes (App Router)
- **Authentication:** Auth0
- **Weather Data:** OpenWeatherMap API
- **Caching:** Redis (with graceful fallback)
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
cp .env.example .env
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
| `REDIS_URL` | Redis connection URL (optional, app works without it) |

### 3. Auth0 Configuration

1. Create a Regular Web Application in Auth0 Dashboard
2. Add `http://localhost:3000/auth/callback` to **Allowed Callback URLs**
3. Add `http://localhost:3000` to **Allowed Logout URLs**
4. Copy the client ID and secret to your `.env` file

### 4. Run Development Server

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

- **Cache keys:** `weather:{cityId}` and `comfort:{cityId}`
- **TTL:** 300 seconds (5 minutes)
- **Fallback:** If Redis is unavailable, the app continues without caching
- **Debug endpoint:** `GET /api/cache/status` shows HIT/MISS and TTL for each city

## Authentication Design

- All dashboard and API routes are protected via Auth0 proxy (Next.js 16 `proxy.ts`)
- Unauthenticated users are redirected to Auth0 login
- API routes return 401 Unauthorized without a valid session
- Secrets are never exposed to client-side code

## Known Limitations

- Redis is optional; without it, every request fetches fresh data from OpenWeatherMap
- Auth0 requires a real tenant configuration; placeholder values won't work
- The Comfort Index uses static weights that don't adapt to seasons
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

- **Unit tests:** Comfort Index scoring functions (temperature, humidity, wind, cloudiness), weather schema validation, cache key patterns
- **Integration tests:** API authentication protection, ranking correctness with real algorithm
- **E2E tests:** Dashboard loading, responsive layout, weight legend display

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
│   ├── dashboard/page.tsx      # Main dashboard page
│   ├── api/
│   │   ├── weather/route.ts    # Weather data endpoint
│   │   ├── rankings/route.ts   # Ranked cities endpoint
│   │   └── cache/status/route.ts # Cache debug endpoint
│   ├── layout.tsx              # Root layout (IBM Plex fonts)
│   ├── page.tsx                # Redirects to /dashboard
│   └── globals.css             # Overcast palette + Tailwind config
├── components/
│   ├── ComfortGauge.tsx        # Semicircular gauge SVG
│   ├── WeightLegend.tsx        # Parameter weight display
│   ├── CityRankingList.tsx     # Ranked city list
│   └── CityRow.tsx             # Expandable city row
├── lib/
│   ├── auth/auth0.ts           # Auth0 client setup
│   ├── weather/
│   │   ├── fetcher.ts          # OpenWeatherMap API client
│   │   └── schema.ts          # Zod validation schemas
│   ├── cache/redis.ts          # Redis cache with fallback
│   └── comfort/
│       ├── index.ts            # Weighted combination
│       ├── temperature.ts      # Temperature scoring
│       ├── humidity.ts         # Humidity scoring
│       ├── wind.ts             # Wind speed scoring
│       └── cloudiness.ts       # Cloudiness scoring
├── types/index.ts              # TypeScript interfaces
├── data/cities.json            # 10 city configurations
└── proxy.ts                    # Auth0 middleware (Next.js 16)
```
