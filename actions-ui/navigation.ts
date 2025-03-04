import { expect, Page } from '@playwright/test'

let page: Page;

const qaId = (id: string): string => `[data-qa-id="${id}"]`;

const pageRoutes = new Map<string, string>(
    Object.entries({
        base: '',
        login: 'login',
        home: 'home',
    })
);

const pageIdentifiers = new Map<string, string>(
    Object.entries({
        base: qaId("login-select"),
        login: "input#username",
        home: qaId("gloabl-navbar"),
    })
);

async function gotoPage (pageName: string) {
    const name = pageName.toLowerCase();
    await page.goto(pageRoutes.get(name));
    validatePage(name);
};

async function validatePage(pageName: string) {
    const name = pageName.toLowerCase();
    await expect(page).toHaveURL( new RegExp(pageRoutes.get(name)) );
    await expect(page.locator(pageIdentifiers.get(name))).toBeVisible();
};

const navigation = (pageContext: Page) => { 
    page = pageContext;
    return { qaId, gotoPage, validatePage };
};

export default navigation;