/// <reference types="cypress" />
describe('Autenticação', { tags: '@regressao' }, () => {
  it('Deve autenticar usuário com sucesso', { tags: ['@smoke', '@media'] }, () => {
    cy.env(['USUARIO_NOME', 'USUARIO_EMAIL', 'USUARIO_SENHA']).then(({ USUARIO_NOME, USUARIO_EMAIL, USUARIO_SENHA }) => {
      // Garante que o usuário existe (se já existir, o cadastro é ignorado)
      cy.cadastrarUsuario(USUARIO_NOME, USUARIO_EMAIL, USUARIO_SENHA, 'false')

      cy.api({
        method: 'POST',
        url: '/login',
        body: { email: USUARIO_EMAIL, password: USUARIO_SENHA }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('authorization')
      })
    })
  })
})
