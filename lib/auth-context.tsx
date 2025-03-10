"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { getUsers, saveUsers } from "@/lib/storage"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  getAllUsers: () => User[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Initialize admin user and load user from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      // Get existing users
      const users = getUsers()

      // Check if admin user exists, if not create it
      if (!users.some((user) => user.username === "admin")) {
        users.push({
          username: "admin",
          email: "admin@example.com",
          password: "admin", // In a real app, this would be hashed
          createdAt: Date.now(),
        })
        saveUsers(users)
      }

      // Check if user is logged in
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }

      setInitialized(true)
    }

    initializeAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = getUsers()
    const foundUser = users.find((user) => user.username === username && user.password === password)

    if (foundUser) {
      // Don't store password in the session
      const { password, ...userWithoutPassword } = foundUser
      setUser(foundUser)
      localStorage.setItem("currentUser", JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = getUsers()

    // Check if username already exists
    if (users.some((user) => user.username === username)) {
      return false
    }

    // Create new user
    const newUser: User = {
      username,
      email,
      password, // In a real app, this would be hashed
      createdAt: Date.now(),
    }

    // Save user
    users.push(newUser)
    saveUsers(users)

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const getAllUsers = (): User[] => {
    return getUsers().map(({ password, ...user }) => user as User)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getAllUsers }}>
      {initialized ? children : null}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

