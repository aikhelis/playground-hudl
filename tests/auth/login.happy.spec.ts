import { test } from "@playwright/test";
import navigation from "../../actions-ui/navigation";
import authentication from "../../actions-ui/authentication";

const validUsername = process.env.USERNAME ?? "";
const validPassword = process.env.PASSWORD ?? "";
let nav, auth; 

test.beforeEach(async ({ page }) => {
  nav = navigation(page);
  auth = authentication(page);
  await nav.gotoScreen("login");
});

test.describe("Login Happy-Path Tests", () => {
  test("Successful login and logout with valid credentials", async ({ page, baseURL }) => {
    await auth.submitUsername(validUsername);
    await auth.submitPassword(validPassword);
    await nav.expectScreen("home");
    await auth.logout();
  });

  test("Successful login with Edit Username step", async ({ page }) => {
    await auth.submitUsername("invalid_" + validUsername);    
    // Go back to correct the entered username
    await auth.editUsername(validUsername);
    await auth.submitPassword(validPassword);
    await nav.expectScreen("home");
    await auth.logout();
  });
});
