const { defineConfig } = require("cypress");
const { plugin: registerGrep } = require("@cypress/grep/plugin");

module.exports = defineConfig({
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress-reporters.json',
  },
  expose: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      registerGrep(config);
      // CYPRESS_BASE_URL (CI) tem prioridade sobre AMBIENTE/URLS do cypress.env.json
      if (!process.env.CYPRESS_BASE_URL) {
        config.baseUrl = config.env.URLS?.[config.env.AMBIENTE] || config.baseUrl;
      }
      return config;
    },
    baseUrl: 'http://localhost:3000',
  },
});
