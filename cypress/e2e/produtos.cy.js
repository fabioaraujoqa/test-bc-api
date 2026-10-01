/// <reference types="cypress" />

describe('Funcionalidade - Produtos', () => {
  let token

  beforeEach(() => {
    cy.gerarToken().then((novoToken) => {
      token = novoToken
    })
  })

  it('Deve cadastrar produto com sucesso', { tags: ['@smoke', '@alta'] }, () => {
    cy.api({
      method: 'POST',
      url: '/produtos',
      headers: { Authorization: token },
      body: {
        nome: `produto teste ${Date.now()}`,
        preco: 100,
        descricao: 'teste',
        quantidade: 50
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
    })
  })
})

