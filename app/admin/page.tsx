"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User } from "@/lib/types"

export default function AdminDashboard() {
  const { user, getAllUsers } = useAuth()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (!user) {
      redirect("/")
    } else if (user.username !== "admin") {
      redirect("/dashboard")
    } else {
      setUsers(getAllUsers())
    }
  }, [user, getAllUsers])

  if (!user || user.username !== "admin") return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 md:p-8">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
          <h2 className="mb-4 text-xl font-semibold">Registered Users</h2>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}

