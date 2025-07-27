"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Music, ArrowLeft, Bell, Shield, Zap, Trash2, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoSync: false,
    notifications: true,
    emailUpdates: false,
    betaFeatures: false,
  })

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen gradient-background-subdued">
      <header className="border-b border-white/20 backdrop-blur-lg" role="banner" style={{ background: "transparent" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl backdrop-blur-sm"
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl animate-pulse-glow shadow-xl"
              aria-hidden="true"
            >
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-dark">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Connected Accounts */}
        <Card
          className="glass-card border-white/40 hover-lift"
          role="region"
          aria-labelledby="connected-accounts-settings-heading"
        >
          <CardHeader>
            <CardTitle id="connected-accounts-settings-heading" className="text-primary-dark flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Connected Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 glass-effect rounded-2xl gap-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg"
                  aria-hidden="true"
                >
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-primary-dark font-semibold">Spotify</h3>
                  <p className="text-secondary-dark text-sm">Connected 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-700 rounded-xl">Active</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-primary-dark hover:bg-white/20 bg-transparent rounded-xl focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-600 hover:bg-red-500/10 bg-transparent rounded-xl focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Disconnect
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 glass-effect rounded-2xl gap-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg"
                  aria-hidden="true"
                >
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-primary-dark font-semibold">YouTube Music</h3>
                  <p className="text-secondary-dark text-sm">Connected 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-700 rounded-xl">Active</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-primary-dark hover:bg-white/20 bg-transparent rounded-xl focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-600 hover:bg-red-500/10 bg-transparent rounded-xl focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Disconnect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Preferences */}
        <Card
          className="glass-card border-white/40 hover-lift"
          role="region"
          aria-labelledby="sync-preferences-heading"
        >
          <CardHeader>
            <CardTitle id="sync-preferences-heading" className="text-primary-dark flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Sync Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 glass-effect rounded-2xl">
              <div>
                <h3 className="text-primary-dark font-semibold">Auto Sync</h3>
                <p className="text-secondary-dark text-sm">Automatically sync new playlists and changes</p>
              </div>
              <Switch
                checked={settings.autoSync}
                onCheckedChange={() => handleSettingChange("autoSync")}
                aria-label="Toggle auto sync"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 glass-effect rounded-2xl">
              <div>
                <h3 className="text-primary-dark font-semibold">Push Notifications</h3>
                <p className="text-secondary-dark text-sm">Get notified when syncs complete</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={() => handleSettingChange("notifications")}
                aria-label="Toggle push notifications"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 glass-effect rounded-2xl">
              <div>
                <h3 className="text-primary-dark font-semibold">Email Updates</h3>
                <p className="text-secondary-dark text-sm">Receive weekly sync summaries via email</p>
              </div>
              <Switch
                checked={settings.emailUpdates}
                onCheckedChange={() => handleSettingChange("emailUpdates")}
                aria-label="Toggle email updates"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 glass-effect rounded-2xl">
              <div>
                <h3 className="text-primary-dark font-semibold">Beta Features</h3>
                <p className="text-secondary-dark text-sm">Access experimental features early</p>
              </div>
              <Switch
                checked={settings.betaFeatures}
                onCheckedChange={() => handleSettingChange("betaFeatures")}
                aria-label="Toggle beta features"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card
          className="glass-card border-white/40 hover-lift"
          role="region"
          aria-labelledby="notification-preferences-heading"
        >
          <CardHeader>
            <CardTitle id="notification-preferences-heading" className="text-primary-dark flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 glass-effect rounded-2xl">
                <h4 className="text-primary-dark font-semibold">Sync Completion</h4>
                <p className="text-secondary-dark text-sm">When your playlists finish syncing</p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 rounded-xl">
                    Push
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-500/20 text-gray-700 rounded-xl">
                    Email
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 p-4 glass-effect rounded-2xl">
                <h4 className="text-primary-dark font-semibold">Sync Errors</h4>
                <p className="text-secondary-dark text-sm">When tracks can't be matched</p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 rounded-xl">
                    Push
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card
          className="bg-red-500/10 border-red-500/30 hover-lift rounded-3xl"
          role="region"
          aria-labelledby="danger-zone-heading"
        >
          <CardHeader>
            <CardTitle id="danger-zone-heading" className="text-red-600">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/20">
              <div>
                <h3 className="text-primary-dark font-semibold">Clear Sync History</h3>
                <p className="text-secondary-dark text-sm">Remove all sync records and statistics</p>
              </div>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-600 hover:bg-red-500/10 bg-transparent rounded-xl focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
              >
                Clear History
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/20">
              <div>
                <h3 className="text-primary-dark font-semibold">Delete Account</h3>
                <p className="text-secondary-dark text-sm">Permanently delete your SyncIt account</p>
              </div>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-600 hover:bg-red-500/10 bg-transparent rounded-xl focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
