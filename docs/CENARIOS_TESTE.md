# Cenários de Teste - ServeRest API

Mapeamento de cenários de teste extraídos da documentação Swagger da ServeRest API.

## 1. LOGIN

### POST /login

#### Cenários Positivos
- [x] **CT001** - Realizar login com credenciais válidas
  - Dados: email válido + senha válida
  - Resposta esperada: 200 OK
  - Retorno: message + authorization token (válido por 600s)

#### Cenários Negativos
- [ ] **CT002** - Login com email inválido
  - Dados: email inválido + senha válida
  - Resposta esperada: 401 Unauthorized
  - Retorno: message "Email e/ou senha inválidos"

- [ ] **CT003** - Login com senha inválida
  - Dados: email válido + senha inválida
  - Resposta esperada: 401 Unauthorized
  - Retorno: message "Email e/ou senha inválidos"

- [ ] **CT004** - Login com email e senha inválidos
  - Dados: email inválido + senha inválida
  - Resposta esperada: 401 Unauthorized
  - Retorno: message "Email e/ou senha inválidos"

- [ ] **CT005** - Login com email vazio
  - Dados: email "" + senha válida
  - Resposta esperada: 401 Unauthorized

- [ ] **CT006** - Login com senha vazia
  - Dados: email válido + senha ""
  - Resposta esperada: 401 Unauthorized

---

## 2. USUÁRIOS

### GET /usuarios

#### Cenários Positivos
- [ ] **CT007** - Listar todos os usuários (sem filtros)
  - Resposta esperada: 200 OK
  - Retorno: quantidade + array de usuários

#### Cenários com Filtros
- [ ] **CT008** - Filtrar usuários por _id
  - Query param: _id={id}
  - Resposta esperada: 200 OK

- [ ] **CT009** - Filtrar usuários por nome
  - Query param: nome={nome}
  - Resposta esperada: 200 OK

- [ ] **CT010** - Filtrar usuários por email
  - Query param: email={email}
  - Resposta esperada: 200 OK

- [ ] **CT011** - Filtrar usuários por password
  - Query param: password={password}
  - Resposta esperada: 200 OK

- [ ] **CT012** - Filtrar usuários por administrador (true)
  - Query param: administrador=true
  - Resposta esperada: 200 OK

- [ ] **CT013** - Filtrar usuários por administrador (false)
  - Query param: administrador=false
  - Resposta esperada: 200 OK

---

### POST /usuarios

#### Cenários Positivos
- [ ] **CT014** - Cadastrar usuário com dados válidos
  - Dados: nome + email + password + administrador
  - Resposta esperada: 201 Created
  - Retorno: message "Cadastro realizado com sucesso" + _id

- [ ] **CT015** - Cadastrar usuário comum (administrador=false)
  - Dados: nome + email + password + administrador=false
  - Resposta esperada: 201 Created

- [ ] **CT016** - Cadastrar usuário administrador (administrador=true)
  - Dados: nome + email + password + administrador=true
  - Resposta esperada: 201 Created

#### Cenários Negativos
- [ ] **CT017** - Cadastrar usuário com email já utilizado
  - Dados: email duplicado + senha + nome + admin
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Este email já está sendo usado"

- [ ] **CT018** - Cadastrar usuário com nome vazio
  - Dados: nome="" + email + password + administrador
  - Resposta esperada: 400 Bad Request

- [ ] **CT019** - Cadastrar usuário com email vazio
  - Dados: nome + email="" + password + administrador
  - Resposta esperada: 400 Bad Request

- [ ] **CT020** - Cadastrar usuário com password vazio
  - Dados: nome + email + password="" + administrador
  - Resposta esperada: 400 Bad Request

- [ ] **CT021** - Cadastrar usuário sem campo nome
  - Dados: missing nome
  - Resposta esperada: 400 Bad Request

- [ ] **CT022** - Cadastrar usuário sem campo email
  - Dados: missing email
  - Resposta esperada: 400 Bad Request

- [ ] **CT023** - Cadastrar usuário sem campo password
  - Dados: missing password
  - Resposta esperada: 400 Bad Request

---

### GET /usuarios/{_id}

#### Cenários Positivos
- [ ] **CT024** - Buscar usuário existente por ID
  - Path param: _id={id_valido}
  - Resposta esperada: 200 OK
  - Retorno: dados completos do usuário

#### Cenários Negativos
- [ ] **CT025** - Buscar usuário inexistente
  - Path param: _id={id_inexistente}
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Usuário não encontrado"

- [ ] **CT026** - Buscar usuário com ID vazio
  - Path param: _id=""
  - Resposta esperada: 400 Bad Request

---

### DELETE /usuarios/{_id}

#### Cenários Positivos
- [ ] **CT027** - Excluir usuário sem carrinho
  - Path param: _id={usuario_sem_carrinho}
  - Resposta esperada: 200 OK
  - Retorno: message "Registro excluído com sucesso"

- [ ] **CT028** - Excluir usuário inexistente
  - Path param: _id={id_inexistente}
  - Resposta esperada: 200 OK
  - Retorno: message "Nenhum registro excluído"

#### Cenários Negativos
- [ ] **CT029** - Excluir usuário com carrinho cadastrado
  - Path param: _id={usuario_com_carrinho}
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Não é permitido excluir usuário com carrinho cadastrado" + idCarrinho

---

### PUT /usuarios/{_id}

#### Cenários Positivos
- [ ] **CT030** - Editar usuário existente
  - Path param: _id={id_existente}
  - Dados: nome + email + password + administrador
  - Resposta esperada: 200 OK
  - Retorno: message "Registro alterado com sucesso"

- [ ] **CT031** - Criar novo usuário via PUT (ID não existe)
  - Path param: _id={id_novo}
  - Dados: nome + email + password + administrador
  - Resposta esperada: 201 Created
  - Retorno: message "Cadastro realizado com sucesso" + _id

#### Cenários Negativos
- [ ] **CT032** - Editar usuário com email já utilizado
  - Path param: _id={id_existente}
  - Dados: nome + email={outro_email_ja_usado} + password + administrador
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Este email já está sendo usado"

- [ ] **CT033** - Editar usuário com nome vazio
  - Path param: _id={id_existente}
  - Dados: nome="" + email + password + administrador
  - Resposta esperada: 400 Bad Request

---

## 3. PRODUTOS

### GET /produtos

#### Cenários Positivos
- [ ] **CT034** - Listar todos os produtos (sem filtros)
  - Resposta esperada: 200 OK
  - Retorno: quantidade + array de produtos

#### Cenários com Filtros
- [ ] **CT035** - Filtrar produtos por _id
  - Query param: _id={id}
  - Resposta esperada: 200 OK

- [ ] **CT036** - Filtrar produtos por nome
  - Query param: nome={nome}
  - Resposta esperada: 200 OK

- [ ] **CT037** - Filtrar produtos por preço
  - Query param: preco={preco} (inteiro >= 1)
  - Resposta esperada: 200 OK

- [ ] **CT038** - Filtrar produtos por descrição
  - Query param: descricao={descricao}
  - Resposta esperada: 200 OK

- [ ] **CT039** - Filtrar produtos por quantidade
  - Query param: quantidade={quantidade} (inteiro >= 0)
  - Resposta esperada: 200 OK

---

### POST /produtos (Requer token de administrador)

#### Cenários Positivos
- [ ] **CT040** - Cadastrar produto com dados válidos (admin)
  - Headers: Authorization: {admin_token}
  - Dados: nome + preco + descricao + quantidade
  - Resposta esperada: 201 Created
  - Retorno: message "Cadastro realizado com sucesso" + _id

#### Cenários Negativos
- [ ] **CT041** - Cadastrar produto com nome duplicado
  - Headers: Authorization: {admin_token}
  - Dados: nome={produto_existente} + preco + descricao + quantidade
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Já existe produto com esse nome"

- [ ] **CT042** - Cadastrar produto sem token
  - Headers: (sem Authorization)
  - Dados: nome + preco + descricao + quantidade
  - Resposta esperada: 401 Unauthorized

- [ ] **CT043** - Cadastrar produto com token inválido
  - Headers: Authorization: {token_invalido}
  - Dados: nome + preco + descricao + quantidade
  - Resposta esperada: 401 Unauthorized

- [ ] **CT044** - Cadastrar produto com token expirado
  - Headers: Authorization: {token_expirado}
  - Dados: nome + preco + descricao + quantidade
  - Resposta esperada: 401 Unauthorized

- [ ] **CT045** - Cadastrar produto como usuário comum (não admin)
  - Headers: Authorization: {user_token}
  - Dados: nome + preco + descricao + quantidade
  - Resposta esperada: 403 Forbidden
  - Retorno: message "Rota exclusiva para administradores"

- [ ] **CT046** - Cadastrar produto com nome vazio
  - Headers: Authorization: {admin_token}
  - Dados: nome="" + preco + descricao + quantidade
  - Resposta esperada: 400 Bad Request

- [ ] **CT047** - Cadastrar produto com preço negativo
  - Headers: Authorization: {admin_token}
  - Dados: nome + preco=-100 + descricao + quantidade
  - Resposta esperada: 400 Bad Request

- [ ] **CT048** - Cadastrar produto com quantidade negativa
  - Headers: Authorization: {admin_token}
  - Dados: nome + preco + descricao + quantidade=-5
  - Resposta esperada: 400 Bad Request

---

### GET /produtos/{_id}

#### Cenários Positivos
- [ ] **CT049** - Buscar produto existente por ID
  - Path param: _id={id_valido}
  - Resposta esperada: 200 OK
  - Retorno: dados completos do produto

#### Cenários Negativos
- [ ] **CT050** - Buscar produto inexistente
  - Path param: _id={id_inexistente}
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Produto não encontrado"

---

### DELETE /produtos/{_id} (Requer token de administrador)

#### Cenários Positivos
- [ ] **CT051** - Excluir produto sem carrinho (admin)
  - Path param: _id={produto_sem_carrinho}
  - Headers: Authorization: {admin_token}
  - Resposta esperada: 200 OK
  - Retorno: message "Registro excluído com sucesso"

- [ ] **CT052** - Excluir produto inexistente (admin)
  - Path param: _id={id_inexistente}
  - Headers: Authorization: {admin_token}
  - Resposta esperada: 200 OK
  - Retorno: message "Nenhum registro excluído"

#### Cenários Negativos
- [ ] **CT053** - Excluir produto que faz parte de carrinho
  - Path param: _id={produto_em_carrinho}
  - Headers: Authorization: {admin_token}
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Não é permitido excluir produto que faz parte de carrinho" + array idCarrinho

- [ ] **CT054** - Excluir produto sem token
  - Path param: _id={id}
  - Headers: (sem Authorization)
  - Resposta esperada: 401 Unauthorized

- [ ] **CT055** - Excluir produto com token inválido
  - Path param: _id={id}
  - Headers: Authorization: {token_invalido}
  - Resposta esperada: 401 Unauthorized

- [ ] **CT056** - Excluir produto como usuário comum (não admin)
  - Path param: _id={id}
  - Headers: Authorization: {user_token}
  - Resposta esperada: 403 Forbidden
  - Retorno: message "Rota exclusiva para administradores"

---

### PUT /produtos/{_id} (Requer token de administrador)

#### Cenários Positivos
- [ ] **CT057** - Editar produto existente (admin)
  - Path param: _id={id_existente}
  - Headers: Authorization: {admin_token}
  - Dados: nome + preco + descricao + quantidade
  - Resposta esperada: 200 OK
  - Retorno: message "Registro alterado com sucesso"

- [ ] **CT058** - Criar novo produto via PUT (ID não existe)
  - Path param: _id={id_novo}
  - Headers: Authorization: {admin_token}
  - Dados: nome + preco + descricao + quantidade
  - Resposta esperada: 201 Created
  - Retorno: message "Cadastro realizado com sucesso" + _id

#### Cenários Negativos
- [ ] **CT059** - Editar produto com nome duplicado
  - Path param: _id={id_existente}
  - Headers: Authorization: {admin_token}
  - Dados: nome={outro_produto_nome} + preco + descricao + quantidade
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Já existe produto com esse nome"

- [ ] **CT060** - Editar produto sem token
  - Path param: _id={id}
  - Headers: (sem Authorization)
  - Dados: nome + preco + descricao + quantidade
  - Resposta esperada: 401 Unauthorized

- [ ] **CT061** - Editar produto como usuário comum (não admin)
  - Path param: _id={id}
  - Headers: Authorization: {user_token}
  - Dados: nome + preco + descricao + quantidade
  - Resposta esperada: 403 Forbidden

---

## 4. CARRINHOS

### GET /carrinhos

#### Cenários Positivos
- [ ] **CT062** - Listar todos os carrinhos
  - Resposta esperada: 200 OK
  - Retorno: quantidade + array de carrinhos (únicos por usuário)

#### Cenários com Filtros
- [ ] **CT063** - Filtrar carrinhos por _id
  - Query param: _id={id}
  - Resposta esperada: 200 OK

- [ ] **CT064** - Filtrar carrinhos por precoTotal
  - Query param: precoTotal={preco} (inteiro >= 1)
  - Resposta esperada: 200 OK

- [ ] **CT065** - Filtrar carrinhos por quantidadeTotal
  - Query param: quantidadeTotal={quantidade} (inteiro >= 0)
  - Resposta esperada: 200 OK

- [ ] **CT066** - Filtrar carrinhos por idUsuario
  - Query param: idUsuario={id}
  - Resposta esperada: 200 OK

---

### POST /carrinhos (Requer token de usuário)

#### Cenários Positivos
- [ ] **CT067** - Cadastrar carrinho com produto válido
  - Headers: Authorization: {user_token}
  - Dados: produtos[{idProduto + quantidade}]
  - Resposta esperada: 201 Created
  - Retorno: message "Cadastro realizado com sucesso" + _id
  - Efeito: reduz quantidade do produto

- [ ] **CT068** - Cadastrar carrinho com múltiplos produtos
  - Headers: Authorization: {user_token}
  - Dados: produtos[{idProduto1 + qty1}, {idProduto2 + qty2}]
  - Resposta esperada: 201 Created

#### Cenários Negativos
- [ ] **CT069** - Cadastrar carrinho com produto duplicado
  - Headers: Authorization: {user_token}
  - Dados: produtos[{idProduto + qty}, {idProduto + qty}]
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Não é permitido possuir produto duplicado"

- [ ] **CT070** - Cadastrar segundo carrinho mesmo usuário
  - Headers: Authorization: {user_token} (já possui carrinho)
  - Dados: produtos[{idProduto + quantidade}]
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Não é permitido ter mais de 1 carrinho"

- [ ] **CT071** - Cadastrar carrinho com produto inexistente
  - Headers: Authorization: {user_token}
  - Dados: produtos[{idProduto_inexistente + quantidade}]
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Produto não encontrado"

- [ ] **CT072** - Cadastrar carrinho com quantidade superior ao estoque
  - Headers: Authorization: {user_token}
  - Dados: produtos[{idProduto + quantidade_insuficiente}]
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Produto não possui quantidade suficiente"

- [ ] **CT073** - Cadastrar carrinho sem token
  - Headers: (sem Authorization)
  - Dados: produtos[{idProduto + quantidade}]
  - Resposta esperada: 401 Unauthorized

- [ ] **CT074** - Cadastrar carrinho com token inválido
  - Headers: Authorization: {token_invalido}
  - Dados: produtos[{idProduto + quantidade}]
  - Resposta esperada: 401 Unauthorized

- [ ] **CT075** - Cadastrar carrinho com array de produtos vazio
  - Headers: Authorization: {user_token}
  - Dados: produtos[]
  - Resposta esperada: 400 Bad Request

---

### GET /carrinhos/{_id}

#### Cenários Positivos
- [ ] **CT076** - Buscar carrinho existente por ID
  - Path param: _id={id_valido}
  - Resposta esperada: 200 OK
  - Retorno: dados completos do carrinho com produtos, precoTotal e quantidadeTotal

#### Cenários Negativos
- [ ] **CT077** - Buscar carrinho inexistente
  - Path param: _id={id_inexistente}
  - Resposta esperada: 400 Bad Request
  - Retorno: message "Carrinho não encontrado"

---

### DELETE /carrinhos/concluir-compra (Requer token de usuário)

#### Cenários Positivos
- [ ] **CT078** - Concluir compra com carrinho válido
  - Headers: Authorization: {user_token_com_carrinho}
  - Resposta esperada: 200 OK
  - Retorno: message "Registro excluído com sucesso"
  - Efeito: carrinho é removido

- [ ] **CT079** - Concluir compra sem carrinho
  - Headers: Authorization: {user_token_sem_carrinho}
  - Resposta esperada: 200 OK
  - Retorno: message "Não foi encontrado carrinho para esse usuário"

#### Cenários Negativos
- [ ] **CT080** - Concluir compra sem token
  - Headers: (sem Authorization)
  - Resposta esperada: 401 Unauthorized

- [ ] **CT081** - Concluir compra com token inválido
  - Headers: Authorization: {token_invalido}
  - Resposta esperada: 401 Unauthorized

- [ ] **CT082** - Concluir compra com token expirado
  - Headers: Authorization: {token_expirado}
  - Resposta esperada: 401 Unauthorized

---

### DELETE /carrinhos/cancelar-compra (Requer token de usuário)

#### Cenários Positivos
- [ ] **CT083** - Cancelar compra com carrinho válido
  - Headers: Authorization: {user_token_com_carrinho}
  - Resposta esperada: 200 OK
  - Retorno: message "Registro excluído com sucesso"
  - Efeito: carrinho é removido E estoque dos produtos é reabastecido

- [ ] **CT084** - Cancelar compra sem carrinho
  - Headers: Authorization: {user_token_sem_carrinho}
  - Resposta esperada: 200 OK
  - Retorno: message "Não foi encontrado carrinho para esse usuário"

#### Cenários Negativos
- [ ] **CT085** - Cancelar compra sem token
  - Headers: (sem Authorization)
  - Resposta esperada: 401 Unauthorized

- [ ] **CT086** - Cancelar compra com token inválido
  - Headers: Authorization: {token_invalido}
  - Resposta esperada: 401 Unauthorized

---

## RESUMO

**Total de Cenários Mapeados: 86**

| Categoria | Qtd |
|-----------|-----|
| Login | 6 |
| Usuários | 28 |
| Produtos | 34 |
| Carrinhos | 18 |
| **TOTAL** | **86** |

## Notas Importantes

- **Autenticação**: Endpoints de Produtos e Carrinhos requerem token via header `Authorization`
- **Token JWT**: Válido por 600 segundos (10 minutos)
- **IDs**: Utilizados em path params para operações específicas
- **Filtros**: Suportam query params para listar com condições
- **Regras de negócio**:
  - Não permitir email duplicado
  - Não permitir nome de produto duplicado
  - Não permitir excluir usuário com carrinho
  - Não permitir excluir produto em uso em carrinho
  - Não permitir mais de 1 carrinho por usuário
  - Reduzir estoque ao criar carrinho
  - Reabastecê-lo ao cancelar compra
