import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import navigation from "../../actions-ui/navigation";
import authentication from "../../actions-ui/authentication";

const validUsername = process.env.USERNAME ?? "";
let nav, auth;

[
  {
    scenarioName: "SQL Injection attempt",
    maliciousInput: "' OR '1'='1",
  },
  {
    scenarioName: "XSS attempt",
    maliciousInput: '<script>alert("xss")</script>',
  },
  {
    scenarioName: "Overflow attempt with 256 characters",
    maliciousInput: faker.string.sample(256),
  },
  {
    scenarioName: "Overflow attempt with 257 characters",
    maliciousInput: faker.string.sample(257),
  },
].forEach(({ scenarioName, maliciousInput }) => {
  test.describe("Login Security Tests", () => {
    test.beforeEach(async ({ page }) => {
      nav = navigation(page);
      auth = authentication(page);
      await nav.gotoScreen("login");
    });

    test(scenarioName, async ({ page }) => {
      await auth.submitUsername(maliciousInput);
      await auth.expectErrorMessage("invalid email format");

      await auth.submitUsername(validUsername);
      await auth.submitPassword(maliciousInput);
      await auth.expectErrorMessage("invalid credentials");
    });
  });
});
