"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface User {
  name: string;
  avatar: string;
  premium: boolean;
}

interface HeaderProps {
  currentUser: User;
}

export function Header({ currentUser }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md z-50 border-b border-border py-3 bg-background/80">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="logo-icon">
              <Music className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Sync<span className="logo-gradient">It</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-foreground font-medium text-sm">
              {currentUser.name}
            </p>
            {currentUser.premium && (
              <p className="text-xs text-brand-600 font-semibold">Premium</p>
            )}
          </div>
          <Avatar>
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-brand-gradStart to-brand-gradEnd text-white">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
