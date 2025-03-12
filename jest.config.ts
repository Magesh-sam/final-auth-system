import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleDirectories: ["node_modules"],

  // Update your moduleNameMapper to match your actual project structure
  moduleNameMapper: {
    // If your components are in a components directory at the root level
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/hooks/(.*)$": "<rootDir>/hooks/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
};

export default createJestConfig(config);
