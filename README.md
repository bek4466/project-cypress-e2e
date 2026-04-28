# project-cypress-e2e

Private Cypress E2E automation framework built around page objects, JSON selectors, JSON test data, and reusable assertions.

## What is included

- Cypress TypeScript test runner configuration
- Local demo app under `test-app`
- Page object model under `cypress/pages`
- JSON selectors under `cypress/selectors`
- JSON fixtures and flow data under `cypress/fixtures` and `cypress/test-data`
- Custom command for reusable login behavior
- Video, screenshots, retries, and type-check script

## Commands

```bash
npm install
npm run start
npm test
npm run cy:open
npm run allure:generate
npm run allure:open
npm run lint:types
```

The automated smoke flow signs in, filters products, adds an item to the cart, checks subtotal, submits checkout, and validates the receipt.

## CI/CD

`Jenkinsfile` provides a declarative pipeline template that checks out the repo, runs `npm ci`, type-checks the framework, executes the Cypress suite against the local app, archives screenshots/videos, and publishes Allure results from `allure-results`.
