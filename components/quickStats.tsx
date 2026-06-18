import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Total syncs", value: "24" },
  { label: "Tracks moved", value: "2,847" },
  { label: "Success rate", value: "95%" },
  { label: "Pending review", value: "3" },
];

export default function QuickStats() {
  return (
    <Card
      className="hover-lift min-w-0"
      role="region"
      aria-labelledby="quick-stats-heading"
    >
      <CardHeader className="pb-3">
        <CardTitle
          id="quick-stats-heading"
          className="text-foreground text-base font-semibold"
        >
          Quick stats
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 break-words">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-3"
            >
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-2xl font-semibold text-foreground mt-0.5">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
