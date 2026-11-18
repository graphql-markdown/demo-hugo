import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.VISUAL_PORT ?? 4173);

// Stabilize font rendering across machines (recommended by Argos).
const launchOptions = {
  args: ["--disable-lcd-text", "--font-render-hinting=none"],
};

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    [process.env.CI ? "dot" : "list"],
    [
      "@argos-ci/playwright/reporter",
      { uploadToArgos: !!process.env.CI && !!process.env.ARGOS_TOKEN },
    ],
  ],
  use: {
    // The site is built for the `/demo-hugo/` base path; the trailing slash
    // keeps relative `page.goto("graphql/...")` calls under it.
    baseURL: `http://localhost:${port}/demo-hugo/`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions } },
  ],
  webServer: {
    // Static output of `npm run build:visual`; build it before running tests.
    command: `npx serve -l ${port} .site`,
    url: `http://localhost:${port}/demo-hugo/`,
    reuseExistingServer: !process.env.CI,
    env: { NO_UPDATE_CHECK: "1" },
  },
});
