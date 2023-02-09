const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'zjbcgo',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://jsonplaceholder.typicode.com",
    viewportWidth: 1400,
    viewportHeight: 1200,
  },
});
