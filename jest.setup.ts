import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import { Toaster, ToasterProps } from "sonner";
import React from "react";
import { redirect } from "next/dist/server/api-utils";
// Mock window.matchMedia for `next-themes`
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
    redirect: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock components used in your Providers
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: jest.fn(() => ({
    theme: "light",
    setTheme: jest.fn(),
    themes: ["light", "dark", "system"],
  })),
}));

// Mock Auth Context
jest.mock("@/lib/auth-context", () => {
  return {
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    useAuth: jest.fn(() => ({
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getAllUsers: jest.fn(),
    })),
  };
});

// Mock Toaster component
jest.mock("sonner", () => ({
  Toaster: React.forwardRef<ToasterProps, React.ComponentProps<typeof Toaster>>(
    () => null
  ),
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
