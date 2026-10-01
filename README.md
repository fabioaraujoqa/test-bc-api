# Teste BC API

Suíte de testes automatizados de API para o [ServeRest](https://serverest.dev), construída com Cypress, Allure Report e GitHub Actions. O objetivo é validar os fluxos principais (cadastro, login, produtos) e documentar formalmente vulnerabilidades conhecidas da API através de testes que falham propositalmente.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (instalado junto com o Node.js)
- Google Chrome instalado (o Cypress roda os testes nesse navegador; Electron está descontinuado)

## Instalação e Configuração

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```

2. Crie o arquivo de variáveis de ambiente local a partir do template:
   ```bash
   cp cypress.env.example.json cypress.env.json
   ```

3. Preencha o `cypress.env.json` (carregado nativamente pelo Cypress, ignorado pelo git):

   | Variável | Descrição |
   |----------|-----------|
   | `AMBIENTE` | Qual entrada de `URLS` usar como `baseUrl`: `local` ou `dev` |
   | `URLS.local` | URL do ServeRest local, ex: `http://localhost:3000` |
   | `URLS.dev` | URL do ambiente público, ex: `https://serverest.dev` |
   | `USUARIO_EMAIL` / `USUARIO_SENHA` | Credenciais do usuário fixo usado nos testes de autenticação e geração de token (ver [`gerarToken`](#comandos-customizados)) |

## Execução dos testes

### Opção 1: servidor e testes em terminais separados (recomendado)

**Terminal 1 — subir o servidor local:**
```bash
npm run server
```

**Terminal 2 — rodar os testes:**
```bash
npm run test
```

### Opção 2: aguardar o servidor automaticamente

```bash
npm run test:ci
```
Espera o servidor responder em `http://localhost:3000` antes de iniciar os testes (usado também no CI).

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run server` | Sobe o servidor ServeRest localmente |
| `npm run test` | Roda toda a suíte no Chrome, com resultados para o Allure |
| `npm run test:ci` | Espera o servidor subir e roda a suíte completa (modo CI) |
| `npm run test:smoke` | Roda só os testes `@smoke` (fluxos principais) |
| `npm run test:alta` | Roda só os testes de prioridade alta (`@alta`) |
| `npm run test:media` | Roda só os testes de prioridade média (`@media`) |
| `npm run test:seguranca` | Roda só os testes de segurança/vulnerabilidades (`@seguranca`) |
| `npm run allure:report` | Gera o relatório Allure a partir dos resultados |
| `npm run allure:open` | Abre o relatório Allure no navegador |

## Cenários de teste

17 cenários no total, organizados por contexto e criticidade. Abaixo, os cenários marcados com ⚠️ são **falhas esperadas**: documentam vulnerabilidades reais da API (a asserção descreve o comportamento correto, que a API hoje não cumpre).

### Autenticação (`autenticacao.cy.js`)

| Cenário | Criticidade |
|---------|-------------|
| Deve realizar login com sucesso | `@smoke` `@alta` |
| Deve rejeitar login com credenciais inválidas | `@alta` |

### Produtos (`produtos.cy.js`)

| Cenário | Criticidade |
|---------|-------------|
| Deve cadastrar produto com sucesso (rota autenticada, via `gerarToken`) | `@smoke` `@alta` |

### Usuários — Funcionalidades básicas (`usuarios.cy.js`)

| Cenário | Criticidade |
|---------|-------------|
| Deve cadastrar usuário administrador | `@smoke` `@alta` |
| Deve cadastrar usuário comum | `@smoke` `@alta` |
| Deve fazer fluxo completo de cadastro, login e acesso | `@smoke` `@media` |
| Deve editar usuário com sucesso | `@smoke` `@media` |
| Deve excluir usuário com sucesso | `@smoke` `@media` |

### Usuários — Validações e regras de negócio (`usuarios.cy.js`)

| Cenário | Criticidade |
|---------|-------------|
| Deve rejeitar email duplicado | `@alta` |
| ⚠️ Deve rejeitar email duplicado com case diferente | `@alta` |

### Usuários — Segurança / Vulnerabilidades (`usuarios.cy.js`, `@seguranca`)

| Cenário | Criticidade |
|---------|-------------|
| Deve bloquear escalação de privilégio do usuário comum | `@media` |
| Deve rejeitar alteração com email de outro usuário | `@alta` |
| ⚠️ Deve não expor senha na listagem pública | `@alta` |
| Deve rejeitar injeção NoSQL em cadastro | `@alta` |
| ⚠️ Deve rejeitar admin fora do domínio | `@alta` |
| Deve rejeitar campos extras e `_id` forçado | `@alta` |
| ⚠️ Deve bloquear exclusão sem autenticação | `@alta` |

### Vulnerabilidades documentadas

| # | Cenário | Comportamento esperado | Comportamento real da API |
|---|---------|------------------------|----------------------------|
| 1 | Email duplicado com case diferente | Rejeitar com 400 | Aceita o cadastro (201), tratando `nome@teste.com` e `NOME@teste.com` como emails diferentes |
| 2 | Listagem pública de usuários | Nunca expor o campo `password` | O campo `password` vem em texto puro na resposta de `GET /usuarios` |
| 3 | Cadastro de admin fora do domínio da empresa | Rejeitar com 400 | Aceita qualquer domínio de email para `administrador: true` |
| 4 | Exclusão de usuário sem autenticação | Rejeitar com 401 | Aceita o `DELETE` sem header `Authorization` |

## Estratégias utilizadas

### Elaboração dos cenários
Os cenários foram priorizados previamente em uma IA (Claude), pedindo os 10 principais casos de teste para cobertura eficiente da API, gerados no padrão Mocha (`it()`). A implementação do código em si (lógica dos testes, comandos customizados, estrutura) foi feita manualmente, sem uso de IA/Copilot, com base em experiência prévia em testes de API.

### Dados de teste
Não há dependência de bibliotecas externas de geração de massa (como `faker-js`). Os dados são:
- fixos em fixtures (`cypress/fixtures/usuarios.json`), para cenários com usuários padrão; ou
- gerados dinamicamente nos próprios testes com JS nativo (`` `usuario${Date.now()}@teste.com` ``), garantindo emails únicos a cada execução.

### Comandos customizados
Definidos em `cypress/support/commands.js`:

- **`cy.cadastrarUsuario(nome, email, password, administrador)`** — cadastra um usuário via `POST /usuarios` e retorna o `_id`. Loga um aviso (`cy.log`) se o cadastro falhar, para facilitar o debug de testes encadeados.
- **`cy.gerarToken()`** — faz login com o usuário fixo do ambiente (`USUARIO_EMAIL`/`USUARIO_SENHA`) e retorna o token (`Bearer ...`). Se o login falhar (ambiente novo, usuário ainda não existe), cadastra esse usuário como administrador antes de tentar novamente. Usado para testar rotas autenticadas (ex: `POST /produtos`).

### Tags e priorização
Os testes são tageados com [`@cypress/grep`](https://www.npmjs.com/package/@cypress/grep) para facilitar a execução seletiva dos cenários mais críticos:

- **Tipo:** `@regressao` (todos), `@smoke` (fluxos principais), `@seguranca` (vulnerabilidades)
- **Risco/prioridade:** `@alta`, `@media`

As tags ficam na opção `tags` do teste (e são herdadas do `describe`):

```js
it('Deve cadastrar usuário administrador', { tags: ['@smoke', '@alta'] }, () => { ... })
```

Para combinar filtros: `--expose grepTags="@smoke+@alta"` (E), `"@smoke @alta"` (OU), `"@regressao+-@seguranca"` (exclusão).

### Relatório e evidências
Resultados vão para `allure-results` via [`allure-cypress`](https://www.npmjs.com/package/allure-cypress). Para cada teste (passando ou falhando), o relatório traz:
- um passo por chamada de API (`POST /login → 200`), com **Request** e **Response** anexados em JSON (`cypress/support/evidencias.js`)
- screenshot em caso de falha
- as tags do `@cypress/grep` (`smoke`, `alta`, `seguranca`...) como tags do Allure, para filtro
- informações do ambiente (Ambiente, Base URL)

Os campos `password` e `authorization` são sempre mascarados como `***` nos anexos, já que o relatório é publicado no GitHub Pages.

```bash
npm run allure:report   # gera o relatório a partir dos resultados
npm run allure:open     # abre o relatório no navegador
```

## CI/CD Pipeline

O projeto usa GitHub Actions para instalar dependências, subir o ServeRest, rodar a suíte, gerar o relatório Allure e publicá-lo no GitHub Pages.

O workflow roda:
- em todo push para `main` ou `develop`
- em toda pull request para `main` ou `develop`
- manualmente, via **Actions → Run workflow**

Qual suíte roda:

| Gatilho | Suíte |
|---------|-------|
| Pull request | `@smoke` |
| Push para `main` / `develop` | todos os testes |
| Execução manual | escolhida nos dropdowns: **Ambiente** (`local`, `dev`) e **Suíte** (`todos`, `smoke`, `alta`, `seguranca`) |

Os ambientes (**Settings → Environments**) guardam a URL alvo e as credenciais:

| Ambiente | Variável `BASE_URL` | Secrets |
|----------|----------------------|---------|
| `local` | opcional (padrão `http://localhost:3000`) | `USUARIO_EMAIL`, `USUARIO_SENHA` |
| `dev` | `https://serverest.dev` | `USUARIO_EMAIL`, `USUARIO_SENHA` |

Pushes e pull requests rodam contra `local` (ServeRest sobe dentro do runner). O ambiente `dev` só roda em execuções manuais, escolhendo-o no dropdown **Ambiente**; o servidor local não é iniciado nesse caso. Os valores chegam ao Cypress como `CYPRESS_BASE_URL`, `CYPRESS_USUARIO_EMAIL` e `CYPRESS_USUARIO_SENHA`; `CYPRESS_BASE_URL` tem prioridade sobre `AMBIENTE`/`URLS` do `cypress.env.json`.

### Visualizar relatórios

O relatório Allure da última execução em `main` é publicado com as actions oficiais do GitHub Pages (`upload-pages-artifact` + `deploy-pages`), sem precisar de branch `gh-pages`:
```
https://{usuario}.github.io/{repositorio}/
```

Configuração única: **Settings → Pages → Source: GitHub Actions**.

Pull requests recebem um comentário automático com a suíte/ambiente executado e o link para o workflow run.

## Estrutura do projeto

```
.
├── cypress/
│   ├── e2e/                    # Specs: usuarios, autenticacao, produtos
│   ├── fixtures/                # Massa de dados fixa (usuarios.json)
│   └── support/                 # Comandos customizados e evidências do Allure
├── .github/
│   └── workflows/
│       └── test.yml             # Workflow do GitHub Actions
├── cypress.config.js             # Configuração do Cypress (grep, Allure, ambientes)
├── cypress.env.example.json      # Template do cypress.env.json
├── package.json
└── README.md
```
