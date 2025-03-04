import { expect, Page } from '@playwright/test'
import qaId from './navigation';
import dotenv from "dotenv";
import path from "path";

let page: Page;

const selectors = {
  loginButton: 'sign-in-button',
  emailField: 'email',
  passwordField: 'password',
  menuButton: 'menu-button',
  logoutButton: 'logout',
  invalidLoginErrorMessage: 'error-message'
}

const invalidLogin = async (page: Page): Promise<void> => {
  const username = 'invalidLogin@imgarena.com'
  const password = '1nVal!dP4assw0rd'

  await page.goto('./login')
  await page.getByTestId(selectors.emailField).fill(username)
  await page.getByTestId(selectors.passwordField).fill(password)
  await page.keyboard.press('Enter')
  await expect(page.getByTestId(selectors.invalidLoginErrorMessage)).toHaveText('Username or Password Wrong')
}

const login = async (page: Page, loginUsername?: string, loginPassword?: string): Promise<void> => {
  let username = ''
  let password = ''
  if (!loginUsername || !loginPassword) {
    username = process.env.TEST_USERNAME || ''
    password = process.env.TEST_PASSWORD || ''
    if (!username || !password) {
      const environment = dotenv.config({ path: './.env.credentials' })
      if (environment?.error) {
        throw environment.error
      }
      username = environment?.parsed?.TEST_USERNAME || ''
      password = environment?.parsed?.TEST_PASSWORD || ''
    }
  } else {
    username = loginUsername
    password = loginPassword
  }

  if (!username || !password) {
    throw new Error('Username and Password is not set in environment. Please check README.md file.')
  }
  await page.getByTestId(selectors.emailField).fill(username)
  await page.getByTestId(selectors.passwordField).fill(password)

  await page.keyboard.press('Enter')
  await page.waitForURL('**/dashboard/**')
  await page.getByTestId(selectors.menuButton).isVisible()
}

const logout = async (page: Page): Promise<void> => {
  await page.getByTestId(selectors.menuButton).click()
  await page.getByTestId(selectors.logoutButton).click()
  await expect(page).toHaveURL(/login/)
}

const authentication = (pageContext: Page) => {
  page = pageContext;
  return {  };
}

export default authentication
