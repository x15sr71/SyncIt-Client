"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Music,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const stats = [
    { label: "Total Syncs", value: "24", icon: TrendingUp },
    { label: "Tracks Synced", value: "2,847", icon: Music },
    { label: "Success Rate", value: "95%", icon: Award },
    { label: "Member Since", value: "Dec 2024", icon: Calendar },
  ];

  const recentActivity = [
    {
      action: "Synced 'My Favorites' playlist",
      time: "2 hours ago",
      status: "success",
    },
    {
      action: "Connected YouTube Music",
      time: "2 hours ago",
      status: "success",
    },
    { action: "Connected Spotify", time: "2 hours ago", status: "success" },
    { action: "Created account", time: "2 hours ago", status: "success" },
  ];

  return (
    <div className="min-h-screen gradient-background-subdued">
      <header
        className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <div className="logo-icon" aria-hidden="true">
              <Music className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-foreground">
              Profile
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Info */}
        <Card
          className="hover-lift"
          role="region"
          aria-labelledby="profile-info-heading"
        >
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-20 h-20 border border-border shadow-elev">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="bg-gradient-to-br from-brand-gradStart to-brand-gradEnd text-white text-xl font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left flex-1">
                <h2
                  id="profile-info-heading"
                  className="text-2xl font-bold text-primary-dark mb-2"
                >
                  John Doe
                </h2>
                <p className="text-secondary-dark mb-4">john.doe@example.com</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-purple-500/20 text-purple-700 rounded-xl">
                    Free Plan
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-700 rounded-xl">
                    Verified
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-700 rounded-xl">
                    Early Adopter
                  </Badge>
                </div>
              </div>

              <Button className="px-5 py-2.5">Upgrade to Pro</Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="hover-lift"
              role="region"
            >
              <CardContent className="p-6 text-center">
                <stat.icon className="w-6 h-6 text-brand-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-primary-dark mb-1">
                  {stat.value}
                </p>
                <p className="text-secondary-dark text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card
          className="hover-lift"
          role="region"
          aria-labelledby="recent-activity-heading"
        >
          <CardHeader>
            <CardTitle
              id="recent-activity-heading"
              className="text-primary-dark flex items-center"
            >
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 glass-effect rounded-2xl hover:bg-white/20 transition-all"
              >
                <div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  aria-hidden="true"
                ></div>
                <div className="flex-1">
                  <p className="text-primary-dark text-sm font-medium">
                    {activity.action}
                  </p>
                  <p className="text-secondary-dark text-xs">{activity.time}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-700 rounded-xl">
                  Success
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card
          className="hover-lift"
          role="region"
          aria-labelledby="account-management-heading"
        >
          <CardHeader>
            <CardTitle
              id="account-management-heading"
              className="text-primary-dark"
            >
              Account Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
              >
                Download My Data
              </Button>
              <Button
                variant="outline"
                className="focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
              >
                Export Sync History
              </Button>
              <Link href="/settings">
                <Button
                  variant="outline"
                  className="w-full focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                >
                  Account Settings
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-600 hover:bg-red-500/10 bg-transparent rounded-xl focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
