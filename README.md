# playground-hudl

This repository is created as personal practice and refreshments on Playwright. It contains some of the e2e tests for the Hudl.com website, which I highly admire. 

## ToDo
- ✅ Add UI abstraction on top of emerged patterns: login page & common nav mechanism. Stay lean.
- ✅ Update playwright to 1.51 for the Copy Prompt feature in the html report on test failures.

## Running Tests 

### Running on GitHub
[GHA workflow](https://github.com/aikhelis/playground-hudl/actions/workflows/playwright.yml) for playwright tests does the following:
- is triggered on push to main and can be kicked off manually
- injects base URL and user creds from GH repository environment variables and secrets
- runs tests in headless chromium
- runs tests against Production
- runs test files in parallel (up to 4 parallel workers)
- saves html report and trace assets on every run with several days of artifact retention

To view the report and go through test execution in Playwright's [Trace viewer](https://playwright.dev/docs/trace-viewer):
- Navigate to a particular run's details
- Download the `playwright-report` archive from the bottom of the page
- Unpack and open `index.html`
- Go to https://trace.playwright.dev/ and upload the trace blob file `playwright-report/data/<scenario-run-id>.zip`

### Running Locally

Install [nodejs and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

```shell
# Install Dependencies
npm install
npx playwright install --with-deps chromium

# Configure Environment Variables
# Copy .env.local.example to .env.local and update the values as needed
cp .env.local.example .env.local

# To run tests locally in headless mode:
npx playwright test

# To debug tests locally:
npx playwright test --ui
```

If tests fail, verify that you have the correct environment variables and configuration settings.

## Test Coverage

### Authn & Authz

| Category          | Scenario                                           | Automated |
|-------------------|----------------------------------------------------|-----------|
| Happy-path        | Successful login and logout with valid credentials | ✅        |
|                   | Successful login with Edit Username step           | ✅        |
| Form validation   | Empty username/password                            | ✅        |
|                   | Invalid email format                               | ✅        |
|                   | Non-existing username                              | ✅        |
|                   | Wrong password                                     | ✅        |
| Web form security | SQL Injection attempt                              | ✅        |
|                   | XSS attempt                                        | ✅        |
|                   | Overflow attempt (256+ alpha-numeric-special characters) | ✅  |

### Further Test Coverage Suggestions

| Functionality         | Scenarios                   | 
|-----------------------|-----------------------------|
| Login with Socials    | Login with Google, Facebook and Apple accounts |
| Recover login details | Forgotten Password Recovery |
| Registration          | Create an account                        |  
|                       | Create an account with duplicate details |
| Access Authorisation & Portal Customisation  | Display of Dashboard Sections & Resources based on:
| | - User Role (Club Manager, Assistant Coach, Player etc) |
| | - Asset Assignments (Federation, League, Club etc) |
| | - Permissions |
| Non-functional requirements for Authn & Authz (as relevant) | Client-side: Performance (such as lighthouse), Compatibility (browser/device/mobile-first) and Accessibility tests |
| | Server-side: Performance, Stress, Soak, Scalability, Geo-scalability and/or Chaos testing |
| | L18n testing (look, feel and functionality in es, pt, zh; tests should be language agnostic; translation correctness best validated separately, as a part of the l18n process) |

## Design Notes

Start-small approach is used aspired by principles of [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) and [AHA!](https://kentcdodds.com/blog/aha-programming)

Domain-specific dimensions and patterns may emerge as we go, and need to be accounted for on a when/if basis.

For example, the following can be anticipated:

- Cross-environment configurations
- Cross-platform testing (browser/OS/device)
- More rigorous parallelisation/sharding
- User sessions clash management (in parallel or coinciding test runs)
- A higher level of UI abstraction (eg screenplay pattern, Playwright page fixtures such as user role specific)
- Test data management approaches (stubbing/mocking for client-side logic tests or against 3rd party services, data seeding/tidy-up for full e2e tests, etc), data abstraction layer, API steps library, etc

## Observed Potential Application Improvements

1. **Security & Tidiness of the end-user facing web pages**
* **Unified login input validation messages:** Consider displaying a unified error code/message for wrong username/password combinations. Currently, a unique user-facing error code & message are added to the login page for a non-registered email account. Apart from error message fragmentation, this approach exposes a security risk by revealing whether a provided email address is registered in the system or not to potential attackers.
* **Tidy public HTML:** Consider removing `data-qa-id` attributes from the web pages served in Production via build tools for improved public-facing impression and security considerations.

2. **Cosmetic Fix:** Correct the typo in the `data-qa-id="gloabl-navbar"` attribute.

3. **Authentication Workflow:** Evaluate transitioning to an authentication micro-service to handle auth requests, rather than serving full HTML on every attempt.
