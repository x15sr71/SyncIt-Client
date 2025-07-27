"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Chrome, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    // Simulate OAuth flow
    setTimeout(() => {
      setIsLoading(false)
      router.push("/connect")
    }, 2000)
  }

  return (
    <div className="min-h-screen gradient-background-subdued">
      <main className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl backdrop-blur-sm"
                aria-label="Go back to home page"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <Card className="glass-card animate-float border-white/40" role="main" aria-labelledby="auth-title">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4" aria-hidden="true">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl animate-pulse-glow shadow-xl">
                  <Music className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle id="auth-title" className="text-2xl font-bold text-primary-dark mb-2">
                Welcome to SyncIt
              </CardTitle>
              <p className="text-secondary-dark" role="doc-subtitle">
                Sign in to start syncing your music across platforms
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-4 rounded-2xl focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 transition-all hover:scale-105 shadow-lg"
                aria-describedby="signin-description"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Chrome className="w-5 h-5 mr-2" aria-hidden="true" />
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>

              <div className="text-center">
                <p id="signin-description" className="text-sm text-muted-dark">
                  By signing in, you agree to our{" "}
                  <Link
                    href="#"
                    className="text-purple-600 hover:text-purple-700 hover:underline focus-visible:outline-2 focus-visible:outline-purple-600 focus-visible:outline-offset-2 rounded font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-purple-600 hover:text-purple-700 hover:underline focus-visible:outline-2 focus-visible:outline-purple-600 focus-visible:outline-offset-2 rounded font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
