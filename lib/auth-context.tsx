"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/types";
import { getUsers, saveUsers } from "@/lib/storage";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      const users = getUsers();

      // Check if admin user exists, if not create it
      if (!users.some((user) => user.username === "admin")) {
        users.push({
          username: "admin",
          email: "admin@example.com",
          password: "admin",
          createdAt: Date.now(),
        });
        saveUsers(users);
      }

      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      setInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsers();
    const foundUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsers();

    if (users.some((user) => user.username === username)) {
      return false;
    }

    const newUser: User = {
      username,
      email,
      password,
      createdAt: Date.now(),
    };

    users.push(newUser);
    saveUsers(users);

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const getAllUsers = (): User[] => {
    return getUsers().map(({ password, ...user }) => user as User);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, getAllUsers }}
    >
      {initialized ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
