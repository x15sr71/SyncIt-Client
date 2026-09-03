import { Music, Settings, User, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface DashboardHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  onLogout?: () => void;
}

export default function DashboardHeader({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header
      className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40"
      role="banner"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-md p-0.5"
          >
            <div className="logo-icon" aria-hidden="true">
              <Music className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground truncate">
              Sync<span className="logo-gradient">It</span>{" "}
              <span className="text-muted-foreground font-normal">
                Dashboard
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 min-w-0">
            <ThemeToggle className="mr-1" />

            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>

            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>

            {onLogout && (
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
                Log out
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-dashboard-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-dashboard-menu"
            className="lg:hidden mt-3 pb-2 border-t border-border pt-3 mobile-menu-enter min-w-0"
            role="navigation"
            aria-label="Dashboard mobile navigation"
          >
            <div className="flex flex-col space-y-2 p-1 min-w-0">
              <div className="flex items-center justify-between p-2 min-w-0">
                <span className="text-sm font-medium text-foreground">
                  Theme
                </span>
                <ThemeToggle />
              </div>
              <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              </Link>
              {onLogout && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
