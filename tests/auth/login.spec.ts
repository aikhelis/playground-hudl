import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

const baseUrl = process.env.BASE_URL + "login";

test("Successful login with valid credentials", async ({ page }) => {
  await page.goto(baseUrl);
  // Use environment variables to manage sensitive credentials securely
  const username: string = "" + process.env.USERNAME;
  const password: string = "" + process.env.PASSWORD;

  await page.fill("input#username", username);
  await page.click('button[type="submit"]');
  await page.fill("input#password", password);
  await page.click('button[type="submit"]');

  // Wait for navigation or a unique element that indicates a successful login
  await expect(page).toHaveURL(/home/);
  // TODO: fix typo in data-qa-id
  await expect(page.locator('[data-qa-id="gloabl-navbar"]')).toBeVisible();
});
