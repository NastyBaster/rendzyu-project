const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://rendzyu-test.web.app',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});