"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Chrome, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      // Redirect to your backend Google OAuth endpoint
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002"}/google/login`;
    } catch (error) {
      console.error("Error initiating Google sign-in:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-background-subdued relative overflow-hidden">
      <span
        className="blob blob-a"
        style={{ top: "5%", right: "-100px" }}
        aria-hidden="true"
      />
      <span
        className="blob blob-b"
        style={{ bottom: "5%", left: "-100px" }}
        aria-hidden="true"
      />
      <main className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="w-full max-w-md fade-in-up">
          <div className="mb-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Go back to home page"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <Card role="main" aria-labelledby="auth-title">
            <CardHeader className="text-center pb-4">
              <div
                className="flex items-center justify-center mb-4"
                aria-hidden="true"
              >
                <div className="logo-icon" style={{ width: 56, height: 56, borderRadius: 14 }}>
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle
                id="auth-title"
                className="text-2xl font-semibold tracking-tight text-foreground mb-1.5"
              >
                Welcome to SyncIt
              </CardTitle>
              <p className="text-sm text-muted-foreground" role="doc-subtitle">
                Sign in to start syncing your music across platforms.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full py-6 text-sm"
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
