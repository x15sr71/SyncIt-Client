import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ConnectedAccounts() {
  return (
    <Card
      className="hover-lift min-w-0"
      role="region"
      aria-labelledby="connected-accounts-heading"
    >
      <CardHeader className="pb-3">
        <CardTitle
          id="connected-accounts-heading"
          className="text-foreground text-base font-semibold"
        >
          Connected accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-3 min-w-0">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-semibold shrink-0"
              style={{ background: "#1db954" }}
              aria-hidden="true"
            >
              S
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground truncate">
                Spotify
              </div>
              <div className="text-xs text-muted-foreground truncate">
                142 playlists
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700"
            >
              Active
            </Badge>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-semibold shrink-0"
              style={{ background: "#ff3b3b" }}
              aria-hidden="true"
            >
              Y
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground truncate">
                YouTube Music
              </div>
              <div className="text-xs text-muted-foreground truncate">
                98 playlists
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700"
            >
              Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
