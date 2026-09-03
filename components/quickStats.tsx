import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuickStatsProps {
  totalSyncs?: number;
  tracksMigrated?: number;
  successRate?: number | null;
  activeAutoSyncs?: number;
}

export default function QuickStats({
  totalSyncs,
  tracksMigrated,
  successRate,
  activeAutoSyncs,
}: QuickStatsProps) {
  const stats = [
    { label: "Total syncs", value: totalSyncs?.toLocaleString() ?? "—" },
    { label: "Tracks moved", value: tracksMigrated?.toLocaleString() ?? "—" },
    {
      label: "Success rate",
      value:
        successRate === null || successRate === undefined
          ? "—"
          : `${successRate}%`,
    },
    { label: "Auto-syncs on", value: activeAutoSyncs?.toLocaleString() ?? "—" },
  ];

  return (
    <Card
      className="hover-lift min-w-0"
      role="region"
      aria-labelledby="quick-stats-heading"
    >
      <CardHeader className="pb-3">
        <CardTitle
          id="quick-stats-heading"
          className="text-foreground text-base font-medium"
        >
          Quick stats
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 break-words">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 p-3 min-w-0"
            >
              <div className="text-[0.7rem] text-muted-foreground truncate">
                {stat.label}
              </div>
              <div className="text-2xl font-medium tracking-tight tabular-nums text-foreground mt-0.5">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
