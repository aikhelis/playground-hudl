import { expect, Page } from '@playwright/test'

let page: Page;

export const qaId = (id: string): string => `[data-qa-id="${id}"]`;

const routes: {[key: string]: string} = {
    base: '',
    login: 'login',
    home: 'home',
};

const selectors: {[key: string]: string} = {
    base: qaId("login-select"),
    login: "input#username",
    home: qaId("gloabl-navbar"),
};

async const gotoPage = (pageName: string) => {
    const name = pageName.toLowerCase();
    await page.goto(routes[name]);
    validatePage(name);
};

async const validatePage = (pageName: string) => {
    const name = pageName.toLowerCase();
    await expect(page).toHaveURL( new RegExp(routes[name]) );
    await expect(page.locator(selectors[name])).toBeVisible();
};

const navigation = (pageContext: Page) => { 
    page = pageContext;
    return { gotoPage, validatePage };
};

export default navigation;