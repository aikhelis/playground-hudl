import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import navigation from "../../actions-ui/navigation";
import authentication from "../../actions-ui/authentication";

let validUsername: string;
let nav, auth;

test.beforeEach(async ({ page }) => {
  validUsername = process.env.USERNAME ?? "";
  nav = navigation(page);
  auth = authentication(page);
});

[
  { scenario: "SQL Injection attempt", input: "' OR '1'='1" },
  { scenario: "XSS attempt", input: '<script>alert("xss")</script>' },
  { scenario: "Overflow attempt with 256 characters", input: faker.string.sample(256) },
  { scenario: "Overflow attempt with 257 characters", input: faker.string.sample(257) },
].forEach(({ scenario, input }) => {
  test.describe("Login Security Tests", () => {
    test.beforeEach(async ({ page }) => {
      await nav.gotoScreen("login");
    });

    test(scenario, async ({ page }) => {
      await auth.submitUsername(input);
      await auth.expectErrorMessage("invalid email format");

      await auth.submitUsername(validUsername);
      await auth.submitPassword(input);
      await auth.expectErrorMessage("invalid credentials");
    });
  });
});
