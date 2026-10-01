/// <reference types="cypress" />

describe('API ServeRest - Cadastro de usuário', { tags: '@regressao' }, () => {
  let usuarios

  beforeEach(() => {
    cy.fixture('usuarios.json').then(data => {
      usuarios = data
    })
  })

  describe('Funcionalidades básicas', () => {
    it('Deve cadastrar usuário administrador', { tags: ['@smoke', '@alta'] }, () => {
      cy.api({
        method: 'POST',
        url: '/usuarios',
        body: {
          ...usuarios.usuarioAdmin,
          email: `admin${Date.now()}@teste.com`
        }
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      })
    })

    it('Deve cadastrar usuário comum', { tags: ['@smoke', '@alta'] }, () => {
      cy.api({
        method: 'POST',
        url: '/usuarios',
        body: {
          ...usuarios.usuarioComum,
          email: `usuario${Date.now()}@teste.com`
        }
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      })
    })

    it('Deve fazer fluxo completo de cadastro, login e acesso', { tags: ['@smoke', '@media'] }, () => {
      let email = `usuario${Date.now()}@teste.com`
      cy.cadastrarUsuario("Fluxo E2E", email, "senha123", "false").then((userId) => {
        cy.api({
          method: 'POST',
          url: '/login',
          body: {
            email: email,
            password: "senha123"
          }
        }).then((loginResponse) => {
          expect(loginResponse.status).to.eq(200)
          expect(loginResponse.body).to.have.property('authorization')
          const token = loginResponse.body.authorization
          cy.api({
            method: 'GET',
            url: `/usuarios/${userId}`,
            headers: {
              Authorization: token
            }
          }).then((getUserResponse) => {
            expect(getUserResponse.status).to.eq(200)
            expect(getUserResponse.body).to.have.property('email', email)
          })
        })
      })
    })

    it('Deve editar usuário com sucesso', { tags: ['@smoke', '@media'] }, () => {
      let email = `usuario${Date.now()}@teste.com`
      let novoEmail = `usuario_editado${Date.now()}@teste.com`
      let nome = 'Usuario Editado'

      cy.cadastrarUsuario('Usuario Teste', email, "senha123", "false")
        .then((userId) => {
          cy.api({
            method: 'PUT',
            url: `/usuarios/${userId}`,
            body: {
              nome: nome,
              email: novoEmail,
              password: "senha123",
              administrador: "false"
            }
          }).then((updateResponse) => {
            expect(updateResponse.status).to.eq(200)
            expect(updateResponse.body).to.have.property('message', 'Registro alterado com sucesso')

            cy.api(`/usuarios/${userId}`).then((getResponse) => {
              expect(getResponse.body.nome).to.equal(nome)
              expect(getResponse.body.email).to.equal(novoEmail)
            })
          })
        })
    })

    it('Deve excluir usuário com sucesso', { tags: ['@smoke', '@media'] }, () => {
      let email = `usuario_${Date.now()}@dominio.com`
      cy.cadastrarUsuario('Usuario Teste', email, 'senha@123', "false")
        .then((userId) => {
          cy.api({
            method: 'DELETE',
            url: `/usuarios/${userId}`,
            failOnStatusCode: false
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200)
            expect(deleteResponse.body).to.have.property('message', 'Registro excluído com sucesso')

            cy.api({
              method: 'GET',
              url: `/usuarios/${userId}`,
              failOnStatusCode: false
            }).then((getResponse) => {
              expect(getResponse.status).to.eq(400)
              expect(getResponse.body).to.have.property('message', 'Usuário não encontrado')
            })
          })
        })
    })
  })

  describe('Validações e business rules', () => {
    it('Deve rejeitar email duplicado', { tags: ['@alta'] }, () => {
      let email = `usuario${Date.now()}@teste.com`
      cy.cadastrarUsuario("Teste duplicado", email, "senha123", "false")
      cy.api({
        method: 'POST',
        url: '/usuarios',
        body: {
          nome: "Teste duplicado",
          email: email,
          password: "senha123",
          administrador: "false"
        },
        failOnStatusCode: false
      }).then((responseDuplicate) => {
        expect(responseDuplicate.status).to.eq(400)
        expect(responseDuplicate.body).to.have.property('message', 'Este email já está sendo usado')
      })
    })

    it('Deve rejeitar email duplicado com case diferente', { tags: ['@alta'] }, () => {
      let email = `usuario_${Date.now()}@dominio.com`
      cy.cadastrarUsuario('Usuario Teste', email, 'senha@123', "false")
        .then(() => {
          cy.api({
            method: 'POST',
            url: '/usuarios',
            body: {
              nome: 'Usuario Teste 2',
              email: email.toUpperCase(),
              password: 'senha@123',
              administrador: "false"
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body).to.satisfy((body) => {
              return body.hasOwnProperty('message') || body.hasOwnProperty('email')
            }, 'Response deve ter message ou email')
          })
        })
    })
  })

  describe('Segurança - Vulnerabilidades', { tags: '@seguranca' }, () => {
    it('Deve bloquear escalação de privilégio do usuário comum', { tags: ['@media'] }, () => {
      let email = `usuario${Date.now()}@teste.com`
      cy.api({
        method: 'POST',
        url: '/usuarios',
        body: {
          ...usuarios.usuarioComum,
          email: email
        }
      }).then((createResponse) => {
        expect(createResponse.status).to.eq(201)
        cy.api({
          method: 'POST',
          url: '/login',
          body: { email, password: usuarios.usuarioComum.password }
        }).then((loginResponse) => {
          expect(loginResponse.status).to.eq(200)
          const token = loginResponse.body.authorization

          cy.api({
            method: 'POST',
            url: '/produtos',
            body: {
              nome: `Produto Teste ${Date.now()}`,
              preco: 100,
              descricao: 'Teste de escalação',
              quantidade: 10
            },
            headers: { Authorization: token },
            failOnStatusCode: false
          }).then((produtoResponse) => {
            expect(produtoResponse.status).to.eq(403)
            expect(produtoResponse.body).to.have.property('message', 'Rota exclusiva para administradores')
          })
        })
      })
    })

    it('Deve rejeitar alteração com email de outro usuário', { tags: ['@alta'] }, () => {
      let email = `usuario1${Date.now()}@teste.com`
      let email2 = `usuario2${Date.now()}@teste.com`

      cy.cadastrarUsuario('Usuario 1', email, 'senha@123', 'false')
        .then(() => {
          cy.cadastrarUsuario('Usuario 2', email2, 'senha@123', 'false')
            .then((userId) => {
              cy.api({
                method: 'PUT',
                url: `/usuarios/${userId}`,
                body: {
                  nome: 'Usuario 2 Alterado',
                  email: email,
                  password: 'senha@123',
                  administrador: "false"
                },
                headers: {},
                failOnStatusCode: false
              }).then((updateResponse) => {
                expect(updateResponse.status).to.eq(400)
                expect(updateResponse.body).to.have.property('message', 'Este email já está sendo usado')
              })
            })
        })
    })

    it('Deve não expor senha na listagem pública', { tags: ['@alta'] }, () => {
      cy.api('/usuarios').then((response) => {
        Cypress._.each(response.body.usuarios, (usuario) => {
          expect(usuario).not.to.have.property('password')
        })
      })
    })

    it('Deve rejeitar injeção NoSQL em cadastro', { tags: ['@alta'] }, () => {
      const injectionPayloads = [
        { "$ne": "" },
        { "$gt": "" },
        { "$where": "this.administrador == 'true'" },
        { "$regex": ".*" }
      ]

      injectionPayloads.forEach((payload) => {
        cy.api({
          method: 'POST',
          url: '/usuarios',
          body: {
            nome: 'Usuario Injetado',
            email: payload,
            password: 'senha@123',
            administrador: "false"
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400, `Payload: ${JSON.stringify(payload)} deveria retornar 400`)
          expect(response.body).to.have.property('email', 'email deve ser uma string')
        })
      })
    })

    it('Deve rejeitar admin fora do domínio', { tags: ['@alta'] }, () => {
      let emailDiferente = `admin_${Date.now()}@outrodominio.com`
      cy.api({
        method: 'POST',
        url: '/usuarios',
        body: {
          nome: 'Usuario Teste',
          email: emailDiferente,
          password: 'senha@123',
          administrador: "true"
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('message')
      })
    })

    it('Deve rejeitar campos extras e _id forçado', { tags: ['@alta'] }, () => {
      cy.api({
        method: 'POST',
        url: '/usuarios',
        body: {
          nome: 'Usuario Teste',
          email: `usuario_${Date.now()}@dominio.com`,
          password: 'senha@123',
          administrador: "false",
          _id: "forcado",
          campoExtra: "valorExtra"
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('_id', '_id não é permitido')
        expect(response.body).to.have.property('campoExtra', 'campoExtra não é permitido')
      })
    })

    it('Deve bloquear exclusão sem autenticação', { tags: ['@alta'] }, () => {
      let email = `usuario_${Date.now()}@dominio.com`

      cy.cadastrarUsuario('Usuario Teste', email, 'senha@123', "false")
        .then((userId) => {
          cy.api({
            method: 'DELETE',
            url: `/usuarios/${userId}`,
            failOnStatusCode: false
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(401, 'DELETE sem autenticação deveria retornar 401!')
          })
        })
    })
  })
})


