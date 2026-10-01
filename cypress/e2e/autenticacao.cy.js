/// <reference types="cypress" />

describe('Autenticação de Usuário no Serverest', () => {
  let usuario

  before(() => {
    cy.env(['USUARIO_EMAIL', 'USUARIO_SENHA']).then(({ USUARIO_EMAIL, USUARIO_SENHA }) => {
      usuario = { email: USUARIO_EMAIL, password: USUARIO_SENHA }
      cy.cadastrarUsuario('Usuario Teste', USUARIO_EMAIL, USUARIO_SENHA, 'false')
    })
  })

  it('Deve realizar login com sucesso', { tags: ['@smoke', '@alta'] }, () => {
    cy.api({
      method: 'POST',
      url: '/login',
      body: usuario
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('Login realizado com sucesso')
      expect(response.body.authorization).to.match(/^Bearer /)
    })
  })

  it('Deve rejeitar login com credenciais inválidas', { tags: ['@alta'] }, () => {
    cy.api({
      method: 'POST',
      url: '/login',
      body: { email: 'naoexiste@teste.com', password: 'senha-errada' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body.message).to.eq('Email e/ou senha inválidos')
    })
  })
})
