import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ConnectedAccounts() {
    return (
        <>
                    <Card
              className="glass-card border-white/40 hover-lift min-w-0"
              role="region"
              aria-labelledby="connected-accounts-heading"
            >
              <CardHeader>
                <CardTitle
                  id="connected-accounts-heading"
                  className="text-primary-dark"
                >
                  Connected Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 min-w-0">
                  <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-3 rounded-2xl flex-1 border border-green-500/30 min-w-0">
                    <div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      aria-hidden="true"
                    ></div>
                    <span className="text-primary-dark font-medium">
                      Spotify
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-700 ml-auto rounded-xl"
                    >
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-500/20 px-4 py-3 rounded-2xl flex-1 border border-red-500/30 min-w-0">
                    <div
                      className="w-3 h-3 bg-red-500 rounded-full"
                      aria-hidden="true"
                    ></div>
                    <span className="text-primary-dark font-medium">
                      YouTube Music
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-red-500/20 text-red-700 ml-auto rounded-xl"
                    >
                      Connected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
        </>
    )
}