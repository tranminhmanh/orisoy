export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to Orisoy SEO Suite
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Keywords Tracked", value: "--" },
          { label: "Content Score", value: "--" },
          { label: "Backlinks", value: "--" },
          { label: "AI Visibility", value: "--" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-card-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
