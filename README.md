# 📌 Protocolo de Solicitações

Sistema backend para gerenciamento de solicitações com upload de fotos, autenticação via JWT, e envio de e-mail via SMTP. Ideal para órgãos públicos, ouvidorias ou empresas que desejam registrar e acompanhar pedidos com localização.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **PostgreSQL** (com Prisma ORM)
- **JWT (JSON Web Token)**
- **Supabase** (armazenamento de imagens)
- **Nodemailer** (envio de e-mails)
- 
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

## 📦 Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar a aplicação
npm run start:dev
```
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
