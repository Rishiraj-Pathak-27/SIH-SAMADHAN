import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Building, Menu, Bell, User, LogOut, Plus, List, BarChart3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">CivicReport</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <Button variant={isActive("/") ? "default" : "ghost"} size="sm" data-testid="nav-home">
                Home
              </Button>
            </Link>
            <Link href="/report">
              <Button variant={isActive("/report") ? "default" : "ghost"} size="sm" data-testid="nav-report">
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </Link>
            <Link href="/my-reports">
              <Button variant={isActive("/my-reports") ? "default" : "ghost"} size="sm" data-testid="nav-my-reports">
                <List className="h-4 w-4 mr-2" />
                My Reports
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin">
                <Button variant={isActive("/admin") ? "default" : "ghost"} size="sm" data-testid="nav-admin">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop User Dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="dropdown-user-menu">
                    <User className="h-4 w-4 mr-2" />
                    {user?.firstName || user?.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                      <span className="text-sm text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link href="/">
                      <Button variant={isActive("/") ? "default" : "ghost"} className="w-full justify-start">
                        Home
                      </Button>
                    </Link>
                    <Link href="/report">
                      <Button variant={isActive("/report") ? "default" : "ghost"} className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Report Issue
                      </Button>
                    </Link>
                    <Link href="/my-reports">
                      <Button variant={isActive("/my-reports") ? "default" : "ghost"} className="w-full justify-start">
                        <List className="h-4 w-4 mr-2" />
                        My Reports
                      </Button>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/admin">
                        <Button variant={isActive("/admin") ? "default" : "ghost"} className="w-full justify-start">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <div className="border-t pt-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout} 
                        disabled={logoutMutation.isPending}
                        className="w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
