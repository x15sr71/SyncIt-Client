"use client";
import { Button } from "@/components/ui/button";
import { Music, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent, type ReactNode } from "react";

/**
 * Anchor nav item. On the home page it smooth-scrolls to the target section
 * (identical to the previous behavior, no URL change); on any other route it
 * navigates to `/#<id>` so the link still works cross-page (e.g. from /pricing).
 */
function SectionLink({
  targetId,
  className,
  onNavigate,
  children,
}: {
  targetId: string;
  className?: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
    onNavigate?.();
  }

  return (
    <Link href={`/#${targetId}`} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 py-3 border-b border-border bg-background/80 backdrop-blur-md"
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-lg p-1.5"
            aria-label="SyncIt - Home"
          >
            <div className="logo-icon" aria-hidden="true">
              <Music className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
              Sync<span className="logo-gradient">It</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label="Main navigation"
          >
            <SectionLink
              targetId="features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-md px-3 py-1.5 hover:bg-accent"
            >
              Features
            </SectionLink>
            <SectionLink
              targetId="how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-md px-3 py-1.5 hover:bg-accent"
            >
              How it works
            </SectionLink>
            <SectionLink
              targetId="faq"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-md px-3 py-1.5 hover:bg-accent"
            >
              FAQ
            </SectionLink>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-md px-3 py-1.5 hover:bg-accent"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button size="sm" aria-label="Get started with SyncIt">
                Get Started
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden mt-3 pb-2 pt-3 border-t border-border mobile-menu-enter"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-1 p-2">
              <SectionLink
                targetId="features"
                onNavigate={() => setIsMenuOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md px-3 py-2 hover:bg-accent text-left"
              >
                Features
              </SectionLink>
              <SectionLink
                targetId="how-it-works"
                onNavigate={() => setIsMenuOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md px-3 py-2 hover:bg-accent text-left"
              >
                How it works
              </SectionLink>
              <SectionLink
                targetId="faq"
                onNavigate={() => setIsMenuOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md px-3 py-2 hover:bg-accent text-left"
              >
                FAQ
              </SectionLink>
              <Link
                href="/pricing"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md px-3 py-2 hover:bg-accent text-left"
              >
                Pricing
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
