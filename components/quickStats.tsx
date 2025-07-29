import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function QuickStats() {
  return (
    <>
      <Card
        className="glass-card border-white/40 hover-lift min-w-0"
        role="region"
        aria-labelledby="quick-stats-heading"
      >
        <CardHeader>
          <CardTitle id="quick-stats-heading" className="text-primary-dark">
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 min-w-0 break-words">
          <div className="flex justify-between">
            <span className="text-secondary-dark">Total Syncs</span>
            <span className="text-primary-dark font-semibold">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-dark">Success Rate</span>
            <span className="text-green-600 font-semibold">95%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-dark">Tracks Synced</span>
            <span className="text-primary-dark font-semibold">2,847</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
