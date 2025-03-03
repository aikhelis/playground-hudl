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

test.describe("Login Happy-Path Tests", () => {
  test("Successful login and logout with valid credentials", async ({ page, baseURL }) => {
    await page.fill("input#username", validUsername);
    await page.click('button[type="submit"]');
    await page.fill("input#password", validPassword);
    await page.click('button[type="submit"]');

    // Wait for navigation or a unique element that indicates a successful login
    await expect(page).toHaveURL(/home/);
    // TODO: fix typo in data-qa-id
    await expect(page.locator('[data-qa-id="gloabl-navbar"]')).toBeVisible();

    // Log out
    await page.click('div.hui-globalusermenu');
    await page.click('[data-qa-id="webnav-usermenu-logout"]');
    // Verify logged out home page
    await expect(page).toHaveURL(baseURL ?? "");
    await expect(page.locator('[data-qa-id="login-select"]')).toBeVisible();
  });

  test("Successful login with Edit Username step", async ({ page }) => {
    // Begin login flow by entering the username
    await page.fill("input#username", "invalid_" + validUsername);
    await page.click('button[type="submit"]');
    await expect(page.locator("input#password")).toBeVisible();

    // Go back to correct the entered username
    await page.click('a[data-link-name="edit-username"]');
    await page.fill("input#username", validUsername);
    await page.click('button[type="submit"]');

    // Continue the login process by entering the password
    await page.fill("input#password", validPassword);
    await page.click('button[type="submit"]');

    // Verify that login was successful
    await expect(page).toHaveURL(/home/);
    await expect(page.locator('[data-qa-id="gloabl-navbar"]')).toBeVisible();

    // Log out
    await page.click('div.hui-globalusermenu');
    await page.click('[data-qa-id="webnav-usermenu-logout"]');
  });
});
