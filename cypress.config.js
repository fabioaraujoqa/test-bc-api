const { defineConfig } = require("cypress");
const { plugin: registerGrep } = require("@cypress/grep/plugin");
const { allureCypress } = require("allure-cypress/reporter");

module.exports = defineConfig({
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
      allureCypress(on, config, {
        resultsDir: 'allure-results',
        // Não gera passos a partir dos comandos do Cypress: eles copiariam o body (com senha) para o relatório.
        // As evidências de cada chamada vêm de cypress/support/evidencias.js, com campos sensíveis mascarados.
        stepsFromCommands: { enabled: false },
        environmentInfo: {
          Ambiente: process.env.AMBIENTE || config.env.AMBIENTE || 'local',
          'Base URL': config.baseUrl,
          Node: process.version,
        },
      });
      return config;
    },
    baseUrl: 'http://localhost:3000',
  },
});
