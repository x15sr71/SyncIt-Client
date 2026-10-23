import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Resolve the @/* path alias defined in tsconfig.json
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          // ts-jest needs CommonJS modules to run in Node
          module: "commonjs",
          jsx: "react-jsx",
        },
      },
    ],
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  collectCoverageFrom: [
    "hooks/**/*.ts",
    "hooks/**/*.tsx",
    "app/**/*.ts",
    "utils/**/*.ts",
  ],
};

export default config;
