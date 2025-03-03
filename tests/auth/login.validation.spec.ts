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

test.describe("Login Negative Tests", () => {
  test("Empty username/password", async ({ page }) => {
    // Browser validation of required inputs: username
    await page.fill("input#username", "");
    await expect(page.locator("input#username[required]:invalid")).toBeAttached();
    await page.click('button[type="submit"]');
    await expect(page.locator("input#password")).toBeHidden();

    await page.fill("input#username", validUsername);
    await expect(page.locator("input#username[required]:valid")).toBeAttached();
    await page.click('button[type="submit"]');
    await expect(page.locator("input#password")).toBeVisible();

    // Browser validation of required inputs: password
    await page.fill("input#password", "");
    await expect(page.locator("input#password[required]:invalid")).toBeAttached();
    await page.click('button[type="submit"]');
    await expect(page.locator("input#password")).toBeVisible();

    await page.fill("input#password", validPassword);
    await expect(page.locator("input#password[required]:valid")).toBeAttached();    
  });

  test("Invalid email format", async ({ page }) => {
    // Form validation: email format
    await page.fill("input#username", "invalidEmailFormat");
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-error-code="invalid-email-format"]')).toBeVisible();
  });

  test("Non-existing username", async ({ page }) => {
    // Fail Authentication: Non-existing username
    await page.fill("input#username", "non-existing-username@test.com");
    await page.click('button[type="submit"]');
    await page.fill("input#password", validPassword);
    await page.click('button[type="submit"]');
    // FIXME: secruity risk by exposing that email isn't registered via a custom, user-facing error message
    await expect(page.locator('[data-error-code="custom-script-error-code_invalid_user_password"]')).toBeVisible();
  });

  test("Wrong password", async ({ page }) => {
    // Fail Authentication: wrong password
    await page.fill("input#username", validUsername);
    await page.click('button[type="submit"]');
    await page.fill("input#password", "wrongPassword");
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-error-code="wrong-email-credentials"]')).toBeVisible();
  });
});
