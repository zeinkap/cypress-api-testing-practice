const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'zjbcgo',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://my-json-server.typicode.com/zeinkap/cypress-api-testing-practice",
    viewportWidth: 1400,
    viewportHeight: 1200,
  },
});
