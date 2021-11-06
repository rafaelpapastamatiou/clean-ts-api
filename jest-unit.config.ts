import config from "./jest.config";

(config as Record<string, unknown>).testMatch = ["**/*.spec.ts"];

export default config;
