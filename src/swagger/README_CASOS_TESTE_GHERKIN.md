
# Casos de Teste - API TCC (Gherkin)

Este documento contém casos de teste escritos em Gherkin para a API de gerenciamento de moradores, visitantes e visitas.

## Estrutura da API

- **Base URL**: `https://localhost:3000/api`
- **Endpoints principais**: 
  - `/visitas` - Gerenciamento de visitas
  - `/visitantes` - Gerenciamento de visitantes
  - `/resident` - Gerenciamento de moradores
  - `/auth/login` e `/auth/register` - Autenticação

---

## 1. CASOS DE TESTE - AUTENTICAÇÃO

### Cenário 1.1: Login com credenciais válidas
```gherkin
Feature: Autenticação de morador
  Como um morador registrado
  Quero fazer login no sistema
  Para acessar minhas funcionalidades

Scenario: Login bem-sucedido com credenciais válidas
  Given que existe um morador cadastrado com email "morador@teste.com" e senha "123456"
  When eu envio uma requisição POST para "/auth/login"
  And o corpo da requisição contém:
    """
    {
      "email": "morador@teste.com",
      "password": "123456"
    }
    """
  Then o status da resposta deve ser 200
  And a resposta deve conter:
    """
    {
      "resident": {
        "email": "morador@teste.com",
        "_id": "<string>"
      }
    }
    """
```

### Cenário 1.2: Login com credenciais inválidas
```gherkin
Scenario: Login com senha incorreta
  Given que existe um morador cadastrado com email "morador@teste.com"
  When eu envio uma requisição POST para "/auth/login"
  And o corpo da requisição contém:
    """
    {
      "email": "morador@teste.com",
      "password": "senhaerrada"
    }
    """
  Then o status da resposta deve ser 401
  And a resposta deve conter uma mensagem de erro "Invalid credentials"
```

### Cenário 1.3: Login com dados inválidos
```gherkin
Scenario: Login com email em formato inválido
  When eu envio uma requisição POST para "/auth/login"
  And o corpo da requisição contém:
    """
    {
      "email": "email-invalido",
      "password": "123456"
    }
    """
  Then o status da resposta deve ser 400
  And a resposta deve conter uma mensagem de erro "Invalid data"
```

### Cenário 1.4: Registro de novo morador
```gherkin
Scenario: Registro bem-sucedido de novo morador
  Given que não existe um morador com email "novomorador@teste.com"
  When eu envio uma requisição POST para "/auth/register"
  And o corpo da requisição contém:
    """
    {
      "email": "novomorador@teste.com",
      "password": "123456"
    }
    """
  Then o status da resposta deve ser 200
  And a resposta deve conter:
    """
    {
      "resident": {
        "email": "novomorador@teste.com",
        "_id": "<string>"
      }
    }
    """
```

### Cenário 1.5: Registro com email já existente
```gherkin
Scenario: Tentativa de registro com email já cadastrado
  Given que já existe um morador com email "morador@teste.com"
  When eu envio uma requisição POST para "/auth/register"
  And o corpo da requisição contém:
    """
    {
      "email": "morador@teste.com",
      "password": "123456"
    }
    """
  Then o status da resposta deve ser 409
  And a resposta deve conter uma mensagem de erro "Resident already exists"
```

---

## 2. CASOS DE TESTE - MORADORES

### Cenário 2.1: Buscar morador por ID
```gherkin
Feature: Gerenciamento de moradores
  Como um sistema
  Quero gerenciar dados de moradores
  Para manter informações atualizadas

Scenario: Buscar morador existente por ID
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição GET para "/resident"
  And o parâmetro "id" é "507f1f77bcf86cd799439011"
  Then o status da resposta deve ser 200
  And a resposta deve conter os dados do morador:
    """
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
    """
```

### Cenário 2.2: Buscar morador inexistente
```gherkin
Scenario: Buscar morador que não existe
  Given que não existe um morador com ID "507f1f77bcf86cd799439999"
  When eu envio uma requisição GET para "/resident"
  And o parâmetro "id" é "507f1f77bcf86cd799439999"
  Then o status da resposta deve ser 404
  And a resposta deve conter uma mensagem de erro "Resident not found"
```

### Cenário 2.3: Criar novo morador
```gherkin
Scenario: Criar morador com dados completos
  When eu envio uma requisição POST para "/resident"
  And o corpo da requisição contém:
    """
    {
      "name": "João Silva",
      "cpf": "12345678901",
      "phone": "11999999999",
      "email": "joao@teste.com",
      "password": "123456",
      "block": "A",
      "apartment": "101"
    }
    """
  Then o status da resposta deve ser 200
  And a resposta deve conter os dados do morador criado
```

### Cenário 2.4: Criar morador com dados mínimos
```gherkin
Scenario: Criar morador apenas com campos obrigatórios
  When eu envio uma requisição POST para "/resident"
  And o corpo da requisição contém:
    """
    {
      "email": "minimo@teste.com",
      "password": "123456"
    }
    """
  Then o status da resposta deve ser 200
  And a resposta deve conter os dados do morador criado
```

### Cenário 2.5: Deletar morador existente
```gherkin
Scenario: Deletar morador com sucesso
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição DELETE para "/resident"
  And o parâmetro "id" é "507f1f77bcf86cd799439011"
  Then o status da resposta deve ser 200
  And a resposta deve conter uma mensagem de sucesso
```

---

## 3. CASOS DE TESTE - VISITANTES

### Cenário 3.1: Buscar lista de visitantes
```gherkin
Feature: Gerenciamento de visitantes
  Como um morador
  Quero gerenciar minha lista de visitantes
  Para controlar quem pode me visitar

Scenario: Buscar lista de visitantes existente
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  And o morador possui uma lista de visitantes cadastrada
  When eu envio uma requisição GET para "/visitantes"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  Then o status da resposta deve ser 200
  And a resposta deve conter:
    """
    {
      "_id": "<string>",
      "residentId": "507f1f77bcf86cd799439011",
      "records": [
        {
          "_id": "<string>",
          "name": "<string>",
          "cpf": "<string>",
          "createdAt": "<string>",
          "updatedAt": "<string>"
        }
      ],
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
    """
```

### Cenário 3.2: Buscar lista de visitantes inexistente
```gherkin
Scenario: Buscar lista de visitantes que não existe
  Given que não existe lista de visitantes para o morador "507f1f77bcf86cd799439999"
  When eu envio uma requisição GET para "/visitantes"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439999"
  Then o status da resposta deve ser 404
  And a resposta deve conter uma mensagem de erro "Lista de visitantes não encontrada"
```

### Cenário 3.3: Criar/atualizar lista de visitantes
```gherkin
Scenario: Criar nova lista de visitantes
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição POST para "/visitantes"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "registros": [
        {
          "nome": "Maria Santos",
          "cpf": "98765432100",
          "tipo": "Familiar",
          "descricao": "Irmã"
        },
        {
          "nome": "Pedro Oliveira",
          "cpf": "11122233344"
        }
      ]
    }
    """
  Then o status da resposta deve ser 200
  And a resposta deve conter a lista de visitantes atualizada
```

### Cenário 3.4: Criar visitante com dados inválidos
```gherkin
Scenario: Tentar criar visitante sem campos obrigatórios
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição POST para "/visitantes"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "registros": [
        {
          "nome": "Visitante Sem CPF"
        }
      ]
    }
    """
  Then o status da resposta deve ser 400
  And a resposta deve conter uma mensagem de erro "Dados inválidos"
```

### Cenário 3.5: Deletar visitante da lista
```gherkin
Scenario: Deletar visitante específico da lista
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  And o morador possui visitantes cadastrados
  And existe um visitante com CPF "98765432100"
  When eu envio uma requisição DELETE para "/visitantes"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "cpf": "98765432100"
    }
    """
  Then o status da resposta deve ser 200
  And a resposta deve conter uma mensagem de sucesso
```

---

## 4. CASOS DE TESTE - VISITAS

### Cenário 4.1: Buscar lista de visitas
```gherkin
Feature: Gerenciamento de visitas
  Como um morador
  Quero gerenciar minhas visitas agendadas
  Para controlar o acesso ao condomínio

Scenario: Buscar lista de visitas existente
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  And o morador possui visitas agendadas
  When eu envio uma requisição GET para "/visitas"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  Then o status da resposta deve ser 200
  And a resposta deve conter:
    """
    {
      "_id": "<string>",
      "residentId": "507f1f77bcf86cd799439011",
      "visits": [
        {
          "_id": "<string>",
          "visitor": {
            "_id": "<string>",
            "name": "<string>",
            "cpf": "<string>",
            "createdAt": "<string>",
            "updatedAt": "<string>"
          },
          "date": "<string>",
          "residentId": "<string>",
          "createdAt": "<string>",
          "updatedAt": "<string>"
        }
      ],
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
    """
```

### Cenário 4.2: Criar/atualizar lista de visitas
```gherkin
Scenario: Agendar novas visitas
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição POST para "/visitas"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "visitas": [
        {
          "visitante": {
            "nome": "Ana Costa",
            "cpf": "55566677788",
            "tipo": "Amigo",
            "descricao": "Visita social"
          },
          "data": "2024-12-25T14:00:00Z"
        },
        {
          "visitante": {
            "nome": "Carlos Lima",
            "cpf": "99988877766"
          },
          "data": "2024-12-26T10:30:00Z"
        }
      ]
    }
    """
  Then o status da resposta deve ser 200
  And a resposta deve conter a lista de visitas atualizada
```

### Cenário 4.3: Criar visita com dados inválidos
```gherkin
Scenario: Tentar agendar visita sem campos obrigatórios
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição POST para "/visitas"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "visitas": [
        {
          "visitante": {
            "nome": "Visitante Sem CPF"
          },
          "data": "2024-12-25T14:00:00Z"
        }
      ]
    }
    """
  Then o status da resposta deve ser 400
  And a resposta deve conter uma mensagem de erro "Dados inválidos"
```

### Cenário 4.4: Agendar visita para morador inexistente
```gherkin
Scenario: Tentar agendar visita para morador que não existe
  Given que não existe um morador com ID "507f1f77bcf86cd799439999"
  When eu envio uma requisição POST para "/visitas"
  And o parâmetro "moradorId" é "507f1f77bcf86
cd799439999"
  And o corpo da requisição contém:
    """
    {
      "visitas": [
        {
          "visitante": {
            "nome": "Ana Costa",
            "cpf": "55566677788"
          },
          "data": "2024-12-25T14:00:00Z"
        }
      ]
    }
    """
  Then o status da resposta deve ser 404
  And a resposta deve conter uma mensagem de erro "Morador não encontrado"
```

### Cenário 4.5: Deletar visita específica
```gherkin
Scenario: Deletar visita agendada
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  And o morador possui visitas agendadas
  And existe uma visita com ID "507f1f77bcf86cd799439022"
  When eu envio uma requisição DELETE para "/visitas"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "visitaId": "507f1f77bcf86cd799439022"
    }
    """
  Then o status da resposta deve ser 200
  And a resposta deve conter uma mensagem de sucesso
```

### Cenário 4.6: Buscar visitas para morador inexistente
```gherkin
Scenario: Buscar visitas de morador que não existe
  Given que não existe um morador com ID "507f1f77bcf86cd799439999"
  When eu envio uma requisição GET para "/visitas"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439999"
  Then o status da resposta deve ser 404
  And a resposta deve conter uma mensagem de erro "Lista de visitas não encontrada"
```

---

## 5. CASOS DE TESTE - CENÁRIOS DE ERRO

### Cenário 5.1: Erro interno do servidor
```gherkin
Feature: Tratamento de erros
  Como um sistema
  Quero tratar erros adequadamente
  Para fornecer feedback apropriado aos usuários

Scenario: Erro interno do servidor em qualquer endpoint
  Given que ocorre um erro interno no servidor
  When eu envio uma requisição para qualquer endpoint
  Then o status da resposta deve ser 500
  And a resposta deve conter:
    """
    {
      "message": "Internal server error"
    }
    """
```

### Cenário 5.2: Parâmetros obrigatórios ausentes
```gherkin
Scenario: Requisição sem parâmetro obrigatório moradorId
  When eu envio uma requisição GET para "/visitas"
  And não forneço o parâmetro "moradorId"
  Then o status da resposta deve ser 400
  And a resposta deve conter uma mensagem de erro indicando parâmetro obrigatório
```

### Cenário 5.3: Formato de ID inválido
```gherkin
Scenario: Buscar com ID em formato inválido
  When eu envio uma requisição GET para "/resident"
  And o parâmetro "id" é "id-invalido-123"
  Then o status da resposta deve ser 400
  And a resposta deve conter uma mensagem de erro sobre formato inválido
```

---

## 6. CASOS DE TESTE - VALIDAÇÃO DE DADOS

### Cenário 6.1: Validação de CPF
```gherkin
Feature: Validação de dados de entrada
  Como um sistema
  Quero validar dados de entrada
  Para garantir integridade dos dados

Scenario: CPF em formato inválido
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição POST para "/visitantes"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "registros": [
        {
          "nome": "Visitante Teste",
          "cpf": "123.456.789-00"
        }
      ]
    }
    """
  Then o status da resposta deve ser 400
  And a resposta deve conter uma mensagem de erro sobre formato de CPF
```

### Cenário 6.2: Validação de email
```gherkin
Scenario: Email em formato inválido no registro
  When eu envio uma requisição POST para "/auth/register"
  And o corpo da requisição contém:
    """
    {
      "email": "email-sem-arroba",
      "password": "123456"
    }
    """
  Then o status da resposta deve ser 400
  And a resposta deve conter uma mensagem de erro "Invalid data"
```

### Cenário 6.3: Validação de data
```gherkin
Scenario: Data em formato inválido para visita
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição POST para "/visitas"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "visitas": [
        {
          "visitante": {
            "nome": "Ana Costa",
            "cpf": "55566677788"
          },
          "data": "data-invalida"
        }
      ]
    }
    """
  Then o status da resposta deve ser 400
  And a resposta deve conter uma mensagem de erro sobre formato de data
```

---

## 7. CASOS DE TESTE - CENÁRIOS LIMITE

### Cenário 7.1: Lista vazia de visitantes
```gherkin
Feature: Cenários limite
  Como um sistema
  Quero lidar com cenários limite
  Para garantir robustez da aplicação

Scenario: Criar lista vazia de visitantes
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição POST para "/visitantes"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "registros": []
    }
    """
  Then o status da resposta deve ser 200
  And a resposta deve conter uma lista vazia de visitantes
```

### Cenário 7.2: Nome muito longo
```gherkin
Scenario: Visitante com nome muito longo
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição POST para "/visitantes"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém um visitante com nome de 1000 caracteres
  Then o status da resposta deve ser 400
  And a resposta deve conter uma mensagem de erro sobre tamanho do campo
```

### Cenário 7.3: Múltiplas visitas no mesmo horário
```gherkin
Scenario: Agendar múltiplas visitas para o mesmo horário
  Given que existe um morador com ID "507f1f77bcf86cd799439011"
  When eu envio uma requisição POST para "/visitas"
  And o parâmetro "moradorId" é "507f1f77bcf86cd799439011"
  And o corpo da requisição contém:
    """
    {
      "visitas": [
        {
          "visitante": {
            "nome": "Visitante 1",
            "cpf": "11111111111"
          },
          "data": "2024-12-25T14:00:00Z"
        },
        {
          "visitante": {
            "nome": "Visitante 2",
            "cpf": "22222222222"
          },
          "data": "2024-12-25T14:00:00Z"
        }
      ]
    }
    """
  Then o status da resposta deve ser 200
  And ambas as visitas devem ser agendadas para o mesmo horário
```

---

## 8. CASOS DE TESTE - INTEGRAÇÃO

### Cenário 8.1: Fluxo completo de cadastro e agendamento
```gherkin
Feature: Fluxo integrado
  Como um morador
  Quero realizar um fluxo completo
  Para testar a integração entre funcionalidades

Scenario: Fluxo completo - Registro, login, cadastro de visitante e agendamento
  Given que não existe um morador com email "fluxo@teste.com"
  
  # Registro
  When eu envio uma requisição POST para "/auth/register"
  And o corpo da requisição contém:
    """
    {
      "email": "fluxo@teste.com",
      "password": "123456"
    }
    """
  Then o status da resposta deve ser 200
  And eu armazeno o ID do morador retornado
  
  # Login
  When eu envio uma requisição POST para "/auth/login"
  And o corpo da requisição contém:
    """
    {
      "email": "fluxo@teste.com",
      "password": "123456"
    }
    """
  Then o status da resposta deve ser 200
  
  # Cadastrar visitante
  When eu envio uma requisição POST para "/visitantes"
  And o parâmetro "moradorId" é o ID armazenado
  And o corpo da requisição contém:
    """
    {
      "registros": [
        {
          "nome": "Visitante Fluxo",
          "cpf": "12345678901"
        }
      ]
    }
    """
  Then o status da resposta deve ser 200
  
  # Agendar visita
  When eu envio uma requisição POST para "/visitas"
  And o parâmetro "moradorId" é o ID armazenado
  And o corpo da requisição contém:
    """
    {
      "visitas": [
        {
          "visitante": {
            "nome": "Visitante Fluxo",
            "cpf": "12345678901"
          },
          "data": "2024-12-25T14:00:00Z"
        }
      ]
    }
    """
  Then o status da resposta deve ser 200
  And a visita deve ser agendada com sucesso
```

---

## 9. OBSERVAÇÕES IMPORTANTES

### Pré-condições para Execução dos Testes
1. **Ambiente de teste**: API deve estar rodando em `https://localhost:3000/api`
2. **Base de dados**: Deve estar limpa ou com dados de teste conhecidos
3. **Autenticação**: Alguns endpoints podem requerer autenticação (verificar implementação)

### Dados de Teste Sugeridos
- **IDs válidos**: Use ObjectIds do MongoDB válidos (24 caracteres hexadecimais)
- **CPFs**: Use CPFs válidos para testes positivos e inválidos para testes negativos
- **Emails**: Use emails em formato válido para testes positivos
- **Datas**: Use formato ISO 8601 para datas

### Cenários Adicionais Recomendados
1. **Testes de Performance**: Verificar tempo de resposta dos endpoints
2. **Testes de Segurança**: Validar sanitização de inputs
3. **Testes de Concorrência**: Múltiplas requisições simultâneas
4. **Testes de Backup/Recovery**: Comportamento em falhas de sistema

### Ferramentas Recomendadas
- **Cucumber**: Para execução dos testes Gherkin
- **Postman/Newman**: Para testes de API
- **Jest**: Para testes unitários complementares
- **Artillery**: Para testes de carga

---

## 10. RESUMO DOS CASOS DE TESTE

### Total de Cenários por Funcionalidade:
- **Autenticação**: 5 cenários
- **Moradores**: 5 cenários
- **Visitantes**: 5 cenários
- **Visitas**: 6 cenários
- **Tratamento de Erros**: 3 cenários
- **Validação de Dados**: 3 cenários
- **Cenários Limite**: 3 cenários
- **Integração**: 1 cenário

**Total**: 31 cenários de teste cobrindo todos os aspectos da API

### Cobertura de Testes:
- ✅ Casos de sucesso (happy path)
- ✅ Casos de erro (validação, dados inválidos)
- ✅ Casos limite (edge cases)
- ✅ Integração entre funcionalidades
- ✅ Validação de entrada de dados
- ✅ Tratamento de erros do sistema