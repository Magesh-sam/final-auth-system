"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      redirect("/")
    }
  }, [user])

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 md:p-8">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold">Welcome, {user.username}!</h1>
          <p className="mb-4 text-muted-foreground">You have successfully logged into your account.</p>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </main>
    </div>
  )
}

