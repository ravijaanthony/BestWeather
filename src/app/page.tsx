import { auth0 } from "@/lib/auth/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-foreground">
              Weather Comfort Analytics
            </h1>
            <p className="text-secondary mt-3 text-sm leading-relaxed">
              Rank cities by a custom Comfort Index that rewards cool, calm,
              overcast weather — not just low temperatures.
            </p>
          </div>

          <div className="bg-white/60 border border-secondary/20 rounded-xl p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <svg
                  className="w-8 h-8 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.729-3.56"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-foreground">Sign In</h2>
              <p className="text-sm text-secondary mt-1">
                Access is restricted to authorized users only.
              </p>
            </div>

            <a
              href="/auth/login"
              className="flex items-center justify-center w-full py-3 px-4 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign in with Auth0
            </a>

            <div className="mt-6 pt-4 border-t border-secondary/10">
              <div className="flex flex-wrap justify-center gap-3 text-xs text-secondary">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-semibold text-foreground">45%</span>
                  <span>Temp</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-semibold text-foreground">25%</span>
                  <span>Humidity</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-semibold text-foreground">15%</span>
                  <span>Wind</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-semibold text-foreground">15%</span>
                  <span>Clouds</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-secondary mt-6">
            Comfort Index: cool, calm, overcast weather is comfortable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Weather Comfort Analytics
        </h1>
        <p className="text-secondary mb-8">
          Welcome back, {session.user.name ?? session.user.email}
        </p>
        <a
          href="/dashboard"
          className="inline-block py-3 px-6 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
