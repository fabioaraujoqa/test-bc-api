Cypress.Commands.add('cadastrarUsuario', (nome, email, password, administrador) => {
    cy.api({
        method: 'POST',
        url: '/usuarios',
        body: {
            nome: nome,
            email: email,
            password: password,
            administrador: administrador
        }, 
        failOnStatusCode: false
    }).then((response) => {
        if (!response.body._id) {
            cy.log(`cadastrarUsuario falhou: ${JSON.stringify(response.body)}`)
        }
        return response.body._id
    })
})

Cypress.Commands.add('gerarToken', () => {
    return cy.env(['USUARIO_EMAIL', 'USUARIO_SENHA']).then(({ USUARIO_EMAIL, USUARIO_SENHA }) => {
        return cy.api({
            method: 'POST',
            url: '/login',
            body: { email: USUARIO_EMAIL, password: USUARIO_SENHA },
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 200) return response.body.authorization

            return cy.cadastrarUsuario('Usuario Admin', USUARIO_EMAIL, USUARIO_SENHA, 'true').then(() => {
                return cy.api({
                    method: 'POST',
                    url: '/login',
                    body: { email: USUARIO_EMAIL, password: USUARIO_SENHA }
                }).then((loginResponse) => loginResponse.body.authorization)
            })
        })
    })
})