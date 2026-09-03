"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Chrome, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { backendUrl } from "@/utils/api";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      // Redirect to your backend Google OAuth endpoint
      window.location.href = backendUrl("/google/login");
    } catch (error) {
      console.error("Error initiating Google sign-in:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md fade-in-up">
          <div className="mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full -ml-2 text-muted-foreground hover:text-foreground"
                aria-label="Go back to home page"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <Card
            role="main"
            aria-labelledby="auth-title"
            className="shadow-none border-border/60"
          >
            <CardHeader className="text-center pb-5 pt-8 px-6 sm:px-8">
              <div
                className="flex items-center justify-center mb-4"
                aria-hidden="true"
              >
                <div
                  className="logo-icon"
                  style={{ width: 52, height: 52, borderRadius: 16 }}
                >
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle
                id="auth-title"
                className="text-2xl sm:text-[1.75rem] font-semibold tracking-[-0.02em] text-foreground mb-2"
              >
                Welcome to SyncIt
              </CardTitle>
              <p className="text-sm text-muted-foreground" role="doc-subtitle">
                Sign in to start syncing your music across platforms.
              </p>
            </CardHeader>

            <CardContent className="space-y-5 px-6 sm:px-8 pb-8">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 rounded-full text-sm"
                aria-describedby="signin-description"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      className="w-4 h-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Chrome className="w-4 h-4" aria-hidden="true" />
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>

              <div className="text-center">
                <p
                  id="signin-description"
                  className="text-xs text-muted-foreground leading-relaxed"
                >
                  By signing in, you agree to our{" "}
                  <Link
                    href="#"
                    className="logo-gradient font-medium hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="logo-gradient font-medium hover:underline"
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
  );
}
