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

test.describe("Login Negative Tests", () => {
  test("Empty username/password", async ({ page }) => {
    // Browser validation of required inputs: username
    await auth.submitUsername("");
    await nav.expectRequiredInputValidation("username");
    await nav.expectScreen("login");

    // Browser validation of required inputs: password
    await auth.submitUsername(validUsername);
    await auth.submitPassword("");
    await nav.expectRequiredInputValidation("password");
    await nav.expectScreen("login");
  });

  test("Invalid email format", async ({ page }) => {
    await auth.submitUsername("invalidEmailFormat");
    await auth.expectErrorMessage("invalid email format");
    await nav.expectScreen("login");
  });

  test("Non-existing username", async ({ page }) => {
    await auth.submitUsername("non-existing-username@test.com");
    await auth.submitPassword(validPassword);
    // FIXME: secruity risk by exposing that email isn't registered via a custom, user-facing error message
    await auth.expectErrorMessage("invalid username");
    await nav.expectScreen("login");
  });

  test("Wrong password", async ({ page }) => {
    await auth.submitUsername(validUsername);
    await auth.submitPassword("wrongPassword");
    await auth.expectErrorMessage("invalid credentials");
    await nav.expectScreen("login");
  });
});
