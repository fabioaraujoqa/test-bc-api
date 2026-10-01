# test-bc-api

API testing project using Cypress and Serverest with Allure Report integration.

## Setup

```bash
npm install
cp cypress.env.example.json cypress.env.json
```

Fill in `cypress.env.json` (loaded natively by Cypress, ignored by git):

- `AMBIENTE`: which entry of `URLS` to use as `baseUrl` (`local` or `dev`). Defaults to `http://localhost:3000`.
- `USUARIO_EMAIL` / `USUARIO_SENHA`: credentials of the authentication user.

## Local Development

### Option 1: Running server and tests separately (Recommended)

**Terminal 1 - Start the server:**
```bash
npm run server
```

**Terminal 2 - Run tests:**
```bash
npm run test
```

### Option 2: Waiting for server in same terminal

```bash
npm run test:ci
```
This command waits for the server on `http://localhost:3000` before running tests.

## Reporting

Generate Allure Report from test results:

```bash
npm run allure:report
```

Open the generated report:

```bash
npm run allure:open
```

## CI/CD Pipeline

This project uses GitHub Actions to:
- Install dependencies
- Start the Serverest server
- Run the Cypress test suite (see below)
- Generate Allure Report
- Publish to GitHub Pages (runs on `main` only)

The workflow runs on:
- Every push to `main` or `develop` branches
- Every pull request to `main` or `develop` branches
- Manually, via **Actions → Run workflow**

Which suite runs:

| Trigger | Suite |
|---------|-------|
| Pull request | `@smoke` |
| Push to `main` / `develop` | all tests |
| Manual run | chosen in the dropdowns: **Ambiente** (`local`, `dev`) and **Suíte** (`todos`, `smoke`, `alta`, `seguranca`) |

Environments (**Settings → Environments**) hold the target URL and credentials:

| Environment | Variable `BASE_URL` | Secrets |
|-------------|---------------------|---------|
| `local` | optional (defaults to `http://localhost:3000`) | `USUARIO_EMAIL`, `USUARIO_SENHA` |
| `dev` | `https://serverest.dev` | `USUARIO_EMAIL`, `USUARIO_SENHA` |

Pushes and pull requests run against `local` (ServeRest started inside the runner). `dev` runs only on manual runs, choosing it in the **Ambiente** dropdown; the local server is not started. Values reach Cypress as `CYPRESS_BASE_URL`, `CYPRESS_USUARIO_EMAIL` and `CYPRESS_USUARIO_SENHA`; `CYPRESS_BASE_URL` takes precedence over `AMBIENTE`/`URLS` from `cypress.env.json`.

### View Reports

The Allure report of the latest run on `main` is published with the official GitHub Pages actions (`upload-pages-artifact` + `deploy-pages`), no `gh-pages` branch needed:
```
https://{username}.github.io/{repo}/
```

One-time setup: **Settings → Pages → Source: GitHub Actions**.

Pull requests receive a comment with the suite/environment and a link to the workflow run.

## Project Structure

```
.
├── cypress/                    # Cypress test files
│   ├── e2e/                   # End-to-end tests
│   ├── fixtures/              # Test data
│   └── support/               # Helper functions
├── .github/
│   └── workflows/
│       └── test.yml           # GitHub Actions workflow
├── cypress.config.js          # Cypress configuration
├── cypress-reporters.json     # Multi-reporter configuration
├── package.json
└── README.md
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run server` | Start Serverest API server |
| `npm run test` | Run Cypress tests with Allure reporter |
| `npm run test:ci` | Wait for server + run tests (CI mode) |
| `npm run test:smoke` | Run only `@smoke` tests |
| `npm run test:alta` | Run only high priority (`@alta`) tests |
| `npm run test:media` | Run only medium priority (`@media`) tests |
| `npm run test:seguranca` | Run only security (`@seguranca`) tests |
| `npm run allure:report` | Generate Allure report from results |
| `npm run allure:open` | Open Allure report in browser |

-- Para melhorar depois aqui.

Criei um projeto no Claude que prioriza os cenários de teste mais importantes para garantir a cobertura eficiente da API.
Pedi pra ele priorizar os 10 principais cenários de teste.
Depois pedi pra ele gerar os cenários no padrão mocha , it()
E a implementação foi sem uso de IA e CoPilot. Foi realizada de acordo com minha experiência e conhecimento prévio.



--- Ele sobe o servidor local 
Foi criado o workflow no GitHub Actions para automatizar o processo de teste e geração de relatórios com Allure e no GitHub Pages.

Como dependencia foi utilizada a biblioteca `cypress-plugin-api` para facilitar os testes de API com Cypress ( no dashboard do Cypress), mas isto não interfere na execução no pipeline de CI.

Para massa de dados tem alguns arquivos em fixture ou usei dados gerados dinamicamente nos próprios testes com js nativo. Isso permite maior flexibilidade e controle sobre os dados utilizados nos testes e não depende de bibliotecas externas como faker-js.

Além disto os testes foram tageados com [`@cypress/grep`](https://www.npmjs.com/package/@cypress/grep) para facilitar a identificação e execução seletiva dos cenários mais críticos:

- **Tipo:** `@regressao` (todos), `@smoke` (fluxos principais), `@seguranca` (vulnerabilidades)
- **Risco/prioridade:** `@alta`, `@media`

As tags ficam na opção `tags` do teste (e são herdadas do `describe`):

```js
it('Deve cadastrar usuário administrador', { tags: ['@smoke', '@alta'] }, () => { ... })
```

Para combinar filtros: `--expose grepTags="@smoke+@alta"` (E), `"@smoke @alta"` (OU), `"@regressao+-@seguranca"` (exclusão).
