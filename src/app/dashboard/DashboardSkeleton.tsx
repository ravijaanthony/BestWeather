export function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-secondary/20 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-secondary/10 rounded animate-pulse" />
            <div className="h-4 w-64 bg-secondary/10 rounded animate-pulse mt-2" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-24 bg-secondary/10 rounded animate-pulse hidden sm:block" />
            <div className="h-8 w-16 bg-secondary/10 rounded animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-4 w-40 bg-secondary/10 rounded animate-pulse mb-4" />
          <div className="flex gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 flex-1 bg-secondary/10 rounded animate-pulse" />
            ))}
          </div>

          <div className="h-4 w-48 bg-secondary/10 rounded animate-pulse mb-4 mt-8" />
          <div className="h-32 w-full bg-secondary/10 rounded animate-pulse mb-8" />

          <div className="h-4 w-32 bg-secondary/10 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-full bg-secondary/10 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-secondary/20 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-3 w-64 bg-secondary/10 rounded animate-pulse mx-auto" />
        </div>
      </footer>
    </div>
  );
}
