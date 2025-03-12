"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { ToggleTheme } from "./ToggleTheme";

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href={user?.username === "admin" ? "/admin" : "/dashboard"}
            className="text-xl font-bold"
          >
            Auth System
          </Link>
          {user?.username === "admin" && (
            <nav className="hidden md:flex">
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Admin Dashboard
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ToggleTheme />
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user?.username}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Logout">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
