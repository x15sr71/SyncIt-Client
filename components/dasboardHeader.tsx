import { Music, Settings, User, Sun, Moon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface DashboardHeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}

export default function DashboardHeader({ darkMode, setDarkMode, isMobileMenuOpen, setIsMobileMenuOpen  }: DashboardHeaderProps) {
    return (
        <>
          <header
            className="border-b border-white/20 backdrop-blur-lg"
            role="banner"
            style={{ background: "transparent" }}
          >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 min-w-0">
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center space-x-4 min-w-0">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl animate-pulse-glow shadow-xl"
                    aria-hidden="true"
                  >
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-primary-dark truncate">
                    SyncIt Dashboard
                  </h1>
                </div>
    
                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-4 min-w-0">
                  <div className="flex items-center space-x-2 glass-effect px-4 py-2 min-w-0">
                    <Sun
                      className="w-4 h-4 text-secondary-dark"
                      aria-hidden="true"
                    />
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
                    />
                    <Moon
                      className="w-4 h-4 text-secondary-dark"
                      aria-hidden="true"
                    />
                  </div>
    
                  <Link href="/settings">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl backdrop-blur-sm"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
    
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl backdrop-blur-sm"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                </div>
    
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-dashboard-menu"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
    
              {/* Mobile Menu */}
              {isMobileMenuOpen && (
                <nav
                  id="mobile-dashboard-menu"
                  className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4 glass-effect min-w-0"
                  role="navigation"
                  aria-label="Dashboard mobile navigation"
                >
                  <div className="flex flex-col space-y-4 p-4 min-w-0">
                    <div className="flex items-center justify-between min-w-0">
                      <span className="text-primary-dark font-medium">Theme</span>
                      <div className="flex items-center space-x-2">
                        <Sun
                          className="w-4 h-4 text-secondary-dark"
                          aria-hidden="true"
                        />
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                          aria-label={`Switch to ${
                            darkMode ? "light" : "dark"
                          } mode`}
                        />
                        <Moon
                          className="w-4 h-4 text-secondary-dark"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                  </div>
                </nav>
              )}
            </div>
          </header>
    </>
    )
}