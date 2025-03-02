# playground-hudl

## Running Tests Locally

**Install Dependencies**  
Run `npm install` (or the equivalent command for your package manager) to install all required dependencies.

**Configure Environment Variables**  
Copy `.env.local.example` to `.env.local` (the file is git-ignored) and update the values as needed.

**Run the Test Suite**  
Execute `npx playwright test` to run tests. Check your project's documentation if there is a different command.
Execute `npx playwright test --ui` or install Playwright plug-in in your IDE to debug tests.

**Troubleshooting**  
If tests fail, verify that you have the correct environment variables and configuration settings.

## Test Coverage

_This report aids to illustrate of the thought process behind test design. It's auto-generated by co-polit analyzing the current test file structure and naming conventions. Ensure it remains updated as tests evolve or switch to more fit-for-purpose coverage tooling._

- _Folder names under the `./tests` directory._
- _Spec file names that define the test suites._
- _Names of describe blocks used to group related tests._
- _Individual test names within those describe blocks._

Keep tests folder structure and spec naming updated as tests are added or refactored to ensure the report remains accurate.

### tests/auth

**login.spec.ts** - User Login flow:

- [x] successful log in with valid credentials
- [ ] allows to edit email as a detached user flow step

Negative tests:

- [ ] should display an error message with invalid credentials:
- [ ] invalid password for a registered email
- [ ] not a registered email with a valid password from another account
- [ ] missing email (password field isn't available)
- [ ] missing password

Non-functional tests:

- Login Security tests:
  - [ ] SQL Injection attempt in username field
  - [ ] XSS attempt in username field

### Next tests can be:

### tests/auth

- **forgottenPassword.spec.ts** - Recover Login credentials
- **createAccount.spec.js** - User Registration, including duplicate registrations
- **loginWithSocials.spec.ts** - Log in with a social netwrok account (Google, Facebook, Apple)
- **authorization.spec.js** - Dashboard Components based on User Role (Club Manager, Assistant Coach, Player etc), Asset Assignments (Federation, League, Club) and Permissions (Manager, Assistant, Read-only consultant etc)
- **non-functional tests** - as relevant:
    - client-side performance (such as lighthouse), browser/device/mobile-first compatibility and accessibility tests 
    - server-side performance, stress, soak, scalability, geo-scalability and/or chaos testing 

## Solution Design Notes

Start-small approach is used aspired by principles of [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) and [AHA!](https://kentcdodds.com/blog/aha-programming)

Domain specific dimensions and patterns may emerge as we go, and need to be accounted for on when/if basis.

For example, the following can be anticipated:

- cross environment configurations
- cross platform testing (browser/OS/device)
- more rigorous parallelisation/sharding
- user sessions clash management (in parallel or coinciding test runs)
- higher level of UI abstraction (eg screenplay pattern, Playwright page fixtures such as user role specific)
- discuss to remove `data-qa-id` from Production via build tools (for engineering best practices/PR and security considerations)
- test data management approaches (stubbing/mocking for client-side logic tests or against 3rd party services, data seeding/tidyup for full e2e tests, etc), data abstraction layer, api steps library, etc

## CI/CD

TODO

- [ ] initial GHA workflow for playwright tests with:
  - run in Prod
  - on-demand trigger
  - user creds from GH repository secrets
  - single headless browser
  - save trace assets: always, with prior cleanup of files on the runner
