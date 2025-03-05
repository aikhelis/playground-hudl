import { expect, Page } from "@playwright/test";
import navigation from "./navigation";

let page: Page;
let nav;

const selectors = {
  // login form
  username: "input#username",
  password: "input#password",
  submit: 'button[type="submit"]',
  editUsername: 'a[data-link-name="edit-username"]',
  // logged-in user menu
  usermenu: "div.hui-globalusermenu",
  logout: '[data-qa-id="webnav-usermenu-logout"]',
};

async function submitUsername(username: string) {
  await page.fill(selectors.username, username);
  await page.click(selectors.submit);
}

async function editUsername(username: string) {
  await page.click(selectors.editUsername);
  await submitUsername(username);
}

async function submitPassword(password: string) {
  await page.fill(selectors.password, password);
  await page.click(selectors.submit);
}

// Form validation
const errorCodes = {
  "invalid email format": "invalid-email-format",
  "invalid username": "custom-script-error-code_invalid_user_password",
  "invalid credentials": "wrong-email-credentials",
};

async function expectErrorMessage(message: string) {
  const code = errorCodes[message] ?? "";
  await expect(page.locator(`[data-error-code="${code.toLowerCase()}"]`)).toBeVisible();
}

// User workflow actions
async function login(username: string, password: string) {
  if (!username || !username.includes("@"))
    throw `login: username [${username}] is invalid or is not provided`;
  if (!password) throw `login: password [${password}] is not provided`;

  await nav.gotoScreen("login");
  await submitUsername(username);
  await submitPassword(password);
  await nav.expectScreen("home");
}

async function loginAs(userRole: string) {
  let username = process.env[`${userRole.toUpperCase()}_USERNAME`] ?? "";
  let password = process.env[`${userRole.toUpperCase()}_PASSWORD`] ?? "";
  await login(username, password);
}

async function logout() {
  await page.click(selectors.usermenu);
  await page.click(selectors.logout);
  await nav.expectScreen("base");
}

// Export auth UI actions
const authentication = (pageContext: Page) => {
  page = pageContext;
  nav = navigation(page);
  return {
    submitUsername,
    submitPassword,
    editUsername,
    expectErrorMessage,
    login,
    loginAs,
    logout,
  };
};

export default authentication;
