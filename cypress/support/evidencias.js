import * as allure from 'allure-js-commons'

// Campos que nunca devem aparecer no relatório (ele é publicado no GitHub Pages)
const CAMPOS_SENSIVEIS = ['password', 'authorization']

const mascarar = (dado) => JSON.parse(JSON.stringify(dado ?? null), (chave, valor) =>
  CAMPOS_SENSIVEIS.includes(chave.toLowerCase()) && typeof valor === 'string' ? '***' : valor
)

const json = (dado) => JSON.stringify(mascarar(dado), null, 2)

// cy.api aceita (options), (url), (url, body), (method, url) ou (method, url, body)
const normalizar = (args) => {
  if (typeof args[0] === 'object') return { ...args[0] }
  if (args.length === 1) return { url: args[0] }
  if (/^[A-Z]+$/.test(args[0])) return { method: args[0], url: args[1], body: args[2] }
  return { url: args[0], body: args[1] }
}

// Anexa request e response de toda chamada cy.api no Allure (testes ok e com falha)
const comEvidencia = (originalFn, ...args) => {
  const opcoes = normalizar(args)
  const falharNoStatus = opcoes.failOnStatusCode !== false
  const chamada = `${opcoes.method || 'GET'} ${opcoes.url}`

  return originalFn({ ...opcoes, failOnStatusCode: false }).then((resposta) =>
    allure.step(`${chamada} → ${resposta.status}`, () => {
      allure.attachment('Request', json({ method: opcoes.method || 'GET', url: opcoes.url, headers: opcoes.headers, body: opcoes.body }), 'application/json')
      allure.attachment('Response', json({ status: resposta.status, body: resposta.body }), 'application/json')
    }).then(() => {
      const sucesso = resposta.status >= 200 && resposta.status < 400
      if (falharNoStatus && !sucesso) {
        throw new Error(`${chamada} retornou status ${resposta.status}: ${json(resposta.body)}`)
      }
      return resposta
    })
  )
}

Cypress.Commands.overwrite('api', comEvidencia)

// Leva as tags do @cypress/grep (describe + it) para o Allure
beforeEach(function () {
  const tags = []
  for (let item = this.currentTest; item; item = item.parent) {
    // no it() as tags ficam em unverifiedTestConfig; no describe(), direto em _testConfig
    tags.push(...[].concat(item._testConfig?.unverifiedTestConfig?.tags ?? item._testConfig?.tags ?? []))
  }
  if (tags.length) allure.tags(...tags.map((tag) => tag.replace('@', '')))
})
