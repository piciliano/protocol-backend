# 📌 Protocolo de Solicitações — Backend para Gestão de Demandas Públicas e Privadas

O **Protocolo de Solicitações** é um sistema backend robusto para **registro, acompanhamento e resposta de solicitações**. Ideal para **órgãos públicos, ouvidorias e empresas**, oferece recursos como:
- Upload de fotos com armazenamento na nuvem;
- Autenticação segura com JWT;
- Notificações por e-mail;
- Suporte a localização geográfica.


## ✨ Funcionalidades Principais

- 📄 Registro de solicitações com ou sem fotos;
- 🛡️ Autenticação JWT e controle de acesso por perfil (user, moderator, admin);
- 📬 Envio de e-mails com código de recuperação de senha;
- 🗺️ Suporte à localização geográfica;
- 📦 Armazenamento de imagens via Supabase;

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **PostgreSQL** (com Prisma ORM)
- **JWT (JSON Web Token)**
- **Supabase** (armazenamento de imagens)
- **Nodemailer** (envio de e-mails)
  
---
[![NestJS](https://img.shields.io/badge/NestJS-e0234e?logo=nestjs&logoColor=white)](https://nestjs.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![JWT](https://img.shields.io/badge/JWT-000000?logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/) [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/) [![Nodemailer](https://img.shields.io/badge/Nodemailer-D14836?logo=nodemailer&logoColor=white)](https://nodemailer.com/) [![Bcrypt](https://img.shields.io/badge/Bcrypt-5C3A21?logo=bcrypt&logoColor=white)](https://github.com/kelektiv/node.bcrypt.js) [![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/) [![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=white)](https://prettier.io/) [![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/) 


---

## 📁 Estrutura de Diretórios

```bash
src/
│
├── auth/
│   ├── dto/
│   │   └── login-user.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── jwt-guard.role.ts
│   ├── interfaces/
│   │   └── jwt-payload.interface.ts
│   ├── strategies/
        └── jwt.strategy.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
│
├── request/
│   ├── request.controller.ts
│   ├── request.module.ts
│   └── request.service.ts
│
├── user/
│   ├── user.controller.ts
│   ├── user.module.ts
│   └── user.service.ts
│
├── photo/
│   ├── photo.controller.ts
│   ├── photo.module.ts
│   └── photo.service.ts
│
├── email/
│   ├── email.module.ts
│   └── email.service.ts
│
└── prisma/
    ├── prisma.service.ts
    └── schema.prisma
```

## 🔐 Autenticação
O sistema utiliza:

JWT para autenticação.

Middleware que protege rotas por papel (user, moderator, admin).

Criptografia de senhas com bcryptjs.

Rota de login que retorna um token de acesso.

## ⚙️ Variáveis de Ambiente (.env)

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`PORT`

`DATABASE_URL`

`SUPABASE_URL`

`SUPABASE_KEY`

`EMAIL_HOST`

`EMAIL_PORT`

`EMAIL_USER`

`EMAIL_PASS`

`EMAIL_FROM`

`SECRET_OR_KEY`

`EXPIRES_IN`

# 🛣️ Rotas da API

## Auth (`/auth`)

| Método | Rota      | Descrição                 | Proteção | Corpo (Body)    |
|--------|-----------|---------------------------|----------|-----------------|
| POST   | /login    | Realiza login, retorna JWT | Público  | `LoginUserDto`  |

---

## Photo (`/photo`)

| Método | Rota         | Descrição                               | Proteção | Params        | Upload de Arquivos          |
|--------|--------------|---------------------------------------|----------|---------------|----------------------------|
| POST   | /photo/:id   | Faz upload de até 5 fotos vinculadas ao id | Público  | `id` (ID do pedido) | Campo: `files` (max 5)      |

---

## Request (`/request`)

| Método | Rota                  | Descrição                               | Proteção                     | Corpo (Body)       | Upload de Arquivos          |
|--------|-----------------------|---------------------------------------|------------------------------|--------------------|----------------------------|
| POST   | /request              | Cria uma nova solicitação              | JWT, Role: USER               | `CreateRequestDto`  | -                          |
| POST   | /request/with-photo   | Cria solicitação com upload de fotos  | JWT, Roles: USER, MODERATOR   | `CreateRequestDto`  | Campo: `files` (max 5)     |
| GET    | /request/requests-for-user | Lista solicitações do usuário        | JWT, Roles: USER, MODERATOR, ADMIN | -                  | -                          |
| GET    | /request              | Lista todas as solicitações            | Público                      | -                  | -                          |
| GET    | /request/:id          | Busca solicitação pelo ID              | Público                      | -                  | -                          |
| PATCH  | /request/:id          | Atualiza solicitação pelo ID           | Público                      | `UpdateRequestDto`  | -                          |
| DELETE | /request/:id          | Remove solicitação pelo ID             | Público                      | -                  | -                          |

---

## User (`/user`)

| Método | Rota                  | Descrição                             | Proteção         | Corpo (Body)           | Params      |
|--------|-----------------------|-------------------------------------|------------------|------------------------|-------------|
| POST   | /user                 | Cria um novo usuário                 | Público          | `CreateUserDto`        | -           |
| GET    | /user                 | Lista todos os usuários              | JWT, Role: USER  | -                      | -           |
| POST   | /user/forgot-password  | Solicita recuperação de senha       | Público          | `{ email: string }`    | -           |
| POST   | /user/validate-code    | Valida código de recuperação        | Público          | `{ code: string }`     | -           |
| POST   | /user/reset-password   | Reseta senha                        | Público          | `{ newPassword: string }` | -         |
| GET    | /user/:id              | Busca usuário por ID                | Público          | -                      | `id`        |
| PATCH  | /user/:id              | Atualiza usuário por ID             | Público          | `UpdateUserDto`        | `id`        |
| PATCH  | /user/by-email/:email  | Atualiza papel (role) por email     | Público          | `{ role: Role }`       | `email`     |
| DELETE | /user/:id              | Remove usuário por ID               | Público          | -                      | `id`        |

> 🔎 Para mais detalhes e testes das rotas, acesse a documentação interativa em:  
> `http://localhost:{PORT}/api-docs`

## 🛠️ Rodando o Banco de Dados Localmente

Você pode rodar o banco de dados PostgreSQL de duas formas:

---

### 🐳 Usando Docker (recomendado)

Se você tiver o Docker instalado, pode rodar o banco de dados com apenas um comando:

```bash
docker-compose up -d
```

Esse comando irá subir um container com o PostgreSQL já configurado. O banco será iniciado com as seguintes credenciais:

- **Usuário:** `postgres`  
- **Senha:** `postgres`  
- **Banco de dados:** `protocolo`  
- **Porta:** `5432`

#### 📄 Arquivo `docker-compose.yml`

Aqui está o conteúdo completo do arquivo `docker-compose.yml` que será utilizado:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: protocolo-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: protocolo
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

### 💻 Sem Docker (instalação local)

Caso você não tenha o Docker instalado, também é possível rodar o banco de dados localmente com o PostgreSQL instalado na sua máquina.

#### Passos:

1. Instale o PostgreSQL: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Crie o banco e o usuário com os seguintes comandos:

```sql
CREATE DATABASE protocolo;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE protocolo TO postgres;
```

3. Certifique-se de que seu arquivo `.env` (ou configuração de ambiente) contenha:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/protocolo"
```

---

## 📦 Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar a aplicação
npm run start:dev
```

Pronto! Agora você está com o banco de dados configurado e pronto para uso localmente 🚀

---

## 👤 Autor

[![Neto](https://github.com/piciliano.png?size=100)](https://github.com/piciliano)  
[Neto](https://github.com/piciliano)


