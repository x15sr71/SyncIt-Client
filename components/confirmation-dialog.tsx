"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  confirmVariant?: "default" | "destructive"
  icon?: React.ReactNode
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmVariant = "default",
  icon,
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white/15 backdrop-blur-20 border border-white/30 rounded-3xl shadow-2xl">
        <CardHeader className="pb-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${
                  confirmVariant === "destructive"
                    ? "bg-red-500/20 border-2 border-red-500/40"
                    : "bg-yellow-500/20 border-2 border-yellow-500/40"
                }`}
              >
                {icon || (
                  <AlertTriangle
                    className={`w-6 h-6 ${confirmVariant === "destructive" ? "text-red-600" : "text-yellow-600"}`}
                  />
                )}
              </div>
              <CardTitle className="text-primary-dark text-xl font-bold">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-secondary-dark hover:text-primary-dark hover:bg-white/20 rounded-xl transition-all"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-secondary-dark leading-relaxed">{message}</p>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl border-white/30 text-secondary-dark hover:bg-white/10 hover:text-primary-dark bg-transparent shadow-lg transition-all hover:scale-105"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={`flex-1 rounded-2xl font-semibold shadow-xl transition-all hover:scale-105 ${
                confirmVariant === "destructive"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              }`}
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
