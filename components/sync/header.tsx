"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Music, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface User {
  name: string
  avatar: string
  premium: boolean
}

interface HeaderProps {
  currentUser: User
}

export function Header({ currentUser }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-lg z-50 shadow-sm py-4 bg-black/20">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="logo-icon">
              <Music className="h-6 w-6 text-white absolute inset-0 m-auto" />
            </div>
            <span className="text-2xl font-bold logo-gradient">SyncIt</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-white font-medium">{currentUser.name}</p>
            {currentUser.premium && <p className="text-xs text-yellow-400 font-semibold">Premium</p>}
          </div>
          <Avatar>
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
