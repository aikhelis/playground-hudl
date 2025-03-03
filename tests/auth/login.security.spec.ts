import { test, expect } from "@playwright/test";

let validUsername: string;
let validPassword: string;

test.beforeAll(async () => {
  // Use environment variables to manage sensitive credentials securely
  validUsername = process.env.USERNAME ?? "";
  validPassword = process.env.PASSWORD ?? "";
});

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
});

test.describe("Login Security Tests", () => {
  test("SQL Injection attempt", async ({ page }) => {
    const sqlString = "' OR '1'='1";

    await page.fill('input[name="username"]', sqlString);
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-error-code="invalid-email-format"]')).toBeVisible();

    await page.fill("input#username", validUsername);
    await page.click('button[type="submit"]');
    await page.fill("input#password", sqlString);
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-error-code="wrong-email-credentials"]')).toBeVisible();
  });

  test("XSS attempt", async ({ page }) => {
    const xssString = '<script>alert("xss")</script>';

    await page.fill('input[name="username"]', xssString);
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-error-code="invalid-email-format"]')).toBeVisible();

    await page.fill("input#username", validUsername);
    await page.click('button[type="submit"]');
    await page.fill("input#password", xssString);
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-error-code="wrong-email-credentials"]')).toBeVisible();
  });
});
