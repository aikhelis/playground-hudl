import { expect, Page } from "@playwright/test";

let page: Page;

// App navigation config
const routes: { [key: string]: string } = {
  base: "",
  login: "login",
  home: "home",
};

const qaId = (id: string): string => `[data-qa-id="${id}"]`;
const selectors: { [key: string]: string } = {
  base: qaId("login-select"),
  login: '//h1[contains(text(), "Log In")]',
  // TODO: fix typo in data-qa-id
  home: qaId("gloabl-navbar"),
};

async function gotoScreen(screenName: string) {
  const name = screenName.toLowerCase();
  await page.goto(routes[name]);
  await expectScreen(name);
}

async function expectScreen(screenName: string) {
  const name = screenName.toLowerCase();
  await expect(page).toHaveURL(new RegExp(routes[name]));
  await expect(page.locator(selectors[name])).toBeVisible();
}

// Browser validation of required input fields
async function expectRequiredInputValidation(fieldName: string) {
  await expect(
    page.locator(`input#${fieldName.toLowerCase()}[required]:invalid`)
  ).toBeAttached();
}

// Export common navigation actions
const navigation = (pageContext: Page) => {
  page = pageContext;
  return { gotoScreen, expectScreen, expectRequiredInputValidation };
};

export default navigation;
