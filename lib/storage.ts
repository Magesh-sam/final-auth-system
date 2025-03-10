import type { User } from "@/lib/types"

export function getUsers(): User[] {
  if (typeof window === "undefined") {
    return []
  }

  const usersJson = localStorage.getItem("users")
  if (!usersJson) {
    return []
  }

  try {
    return JSON.parse(usersJson)
  } catch (error) {
    console.error("Failed to parse users from localStorage", error)
    return []
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem("users", JSON.stringify(users))
}

