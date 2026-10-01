require('dotenv').config({ quiet: true });
const { defineConfig } = require("cypress");
const { plugin: registerGrep } = require("@cypress/grep/plugin");

const ambientes = {
  local: process.env.URL_LOCAL,
  dev: process.env.URL_DEV,
};
const ambiente = process.env.AMBIENTE || 'local';

module.exports = defineConfig({
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress-reporters.json',
  },
  expose: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
  env: {
    USUARIO_NOME: process.env.USUARIO_NOME,
    USUARIO_EMAIL: process.env.USUARIO_EMAIL,
    USUARIO_SENHA: process.env.USUARIO_SENHA,
  },
  e2e: {
    setupNodeEvents(on, config) {
      registerGrep(config);
      return config;
    },
    baseUrl: ambientes[ambiente] || 'http://localhost:3000',
  },
});
