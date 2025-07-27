"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreVertical, Edit3, Trash2, FolderX } from "lucide-react"

interface PlaylistActionMenuProps {
  playlistId: string
  playlistName: string
  onRename: (id: string) => void
  onEmpty: (id: string) => void
  onDelete: (id: string) => void
}

export function PlaylistActionMenu({ playlistId, playlistName, onRename, onEmpty, onDelete }: PlaylistActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen])

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="text-secondary-dark hover:text-primary-dark hover:bg-white/20 rounded-xl transition-all p-2"
        aria-label={`Actions for ${playlistName}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <Card
          ref={menuRef}
          className="absolute right-0 top-full mt-2 z-50 w-48 glass-card border-white/40 shadow-xl animate-in slide-in-from-top-2 duration-200"
          role="menu"
        >
          <CardContent className="p-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => handleAction(() => onRename(playlistId))}
                className="w-full justify-start text-primary-dark hover:bg-white/20 rounded-xl transition-all"
                role="menuitem"
              >
                <Edit3 className="w-4 h-4 mr-3" />
                Rename Playlist
              </Button>

              <Button
                variant="ghost"
                onClick={() => handleAction(() => onEmpty(playlistId))}
                className="w-full justify-start text-primary-dark hover:bg-white/20 rounded-xl transition-all"
                role="menuitem"
              >
                <FolderX className="w-4 h-4 mr-3" />
                Empty Playlist
              </Button>

              <Button
                variant="ghost"
                onClick={() => handleAction(() => onDelete(playlistId))}
                className="w-full justify-start text-red-600 hover:bg-red-500/10 hover:text-red-700 rounded-xl transition-all"
                role="menuitem"
              >
                <Trash2 className="w-4 h-4 mr-3" />
                Delete Playlist
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
