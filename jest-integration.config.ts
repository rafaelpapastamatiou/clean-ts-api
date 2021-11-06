import config from "./jest.config";

(config as Record<string, unknown>).testMatch = ["**/*.test.ts"];

export default config;
