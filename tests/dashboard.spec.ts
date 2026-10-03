import { test, expect } from "@playwright/test";

test("user can log in and open the dashboard", async ({ page }) => {
    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;

    if (!email || !password) {
        throw new Error(
        "Set E2E_EMAIL and E2E_PASSWORD before running the Playwright test."
        );
    }

    await page.goto("/login", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
    });

    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForURL(/\/dashboard/, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
    });

    await expect(page).toHaveURL(/\/dashboard/);
});

test("unauthenticated user cannot access a project", async ({ page }) => {
  const response = await page.goto("/dashboard/projects/test-project-id", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  expect(response?.status()).toBe(404);
});

test("user cannot access another user's project", async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Set E2E_EMAIL and E2E_PASSWORD before running the Playwright test."
    );
  }

  await page.goto("/login", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(/\/dashboard/, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  const response = await page.goto(
    "/dashboard/projects/cmuscs6aq0001y8u7ohddsrcf",
    {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    }
  );

  expect(response?.status()).toBe(404);
});

test("user cannot discover another user's project through search", async ({
  page,
}) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Set E2E_EMAIL and E2E_PASSWORD before running the Playwright test."
    );
  }

  await page.goto("/login", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(/\/dashboard/, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  const searchBox = page.getByPlaceholder(
    "Search projects, tasks, milestones..."
  );

  await searchBox.fill("User B Private Project");

  await page.waitForTimeout(1000);

  await expect(
    page.getByText("User B Private Project", { exact: true })
  ).not.toBeVisible();
});