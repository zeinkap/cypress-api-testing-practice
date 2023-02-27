# Cypress API Testing Practice

## Setup
In this project we are using Cypress to test Rest APIs using our own [Fake JSON Server](https://my-json-server.typicode.com/zeinkap/cypress-api-testing-practice/).

## API Tests
The API tests can be found under ./cypress/e2e/main_api_tests.cy.js

## Cypress version and plugins used
We are using Cypress version 12 and the cypress-plugin-api to display API calls in the Cypress TestRunner UI.

## Data
All data (comments, posts and profiles) are stored in the db.json file.

## CI/CD
Integrated with GiHub Actions as part of CI/CD pipeline.
