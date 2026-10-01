Cypress.Commands.add('cadastrarUsuario', (nome, email, password, administrador) => {
    cy.request({
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