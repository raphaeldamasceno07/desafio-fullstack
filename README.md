# Movie Challenge

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.8.5-00d6ff?logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-0C344B?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker&logoColor=white)](https://www.docker.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.x-0D4C92?logo=vitest&logoColor=white)](https://vitest.dev/)

## Descrição

O **Movie Challenge** é uma aplicação Fullstack desenvolvida como parte do desafio técnico da CUBOS. O projeto oferece uma API de filmes com autenticação segura e um frontend em Next.js, conectados em um monorepo que facilita a manutenção, o compartilhamento de tipos e a consistência arquitetural.

O principal objetivo é demonstrar: arquitetura bem definida, proteção de rotas, fluxos de token seguro e experiência completa de CRUD de filmes com cadastro, login e renovação silenciosa de sessão.

---

## Arquitetura e Decisões Técnicas

- **Monorepo**: o repositório é organizado como monorepo em `apps/` e `packages/`, permitindo compartilhar configurações, tipos e regras entre `apps/api` e `apps/web`.
- **Clean Architecture**: o backend separa responsabilidades em `use-cases`, `repositories`, `providers` e camadas de transporte HTTP. Isso melhora a escalabilidade e testabilidade do código.
- **Backend moderno**: Fastify + Prisma + Zod garantem alta performance, validação rigorosa de dados e tipos sólidos.
- **Frontend reativo**: Next.js com App Router, React, TailwindCSS e Axios compõem a interface, enquanto o middleware do Next protege páginas sensíveis.

### Fluxo de segurança da autenticação

1. O usuário realiza login e recebe:
   - um **access token** (JWT) armazenado em cookie no frontend como `movie-challenge.token`
   - um **refresh token** seguro mantido em cookie HTTPOnly pelo Fastify
2. O **Next.js Middleware** valida a existência do cookie `movie-challenge.token` e controla as rotas protegidas:
   - redireciona para `/login` se o token não existir
   - evita acesso à tela de login quando o usuário já está autenticado
3. O **Axios interceptor** insere o header `Authorization: Bearer <token>` em cada requisição e faz a renovação silenciosa do token quando recebe `401` do backend.
4. O backend expõe a rota `PATCH /api/token/refresh` para gerar um novo access token usando o refresh token HTTPOnly.

Esse fluxo combina segurança do servidor com experiência fluida no cliente.

---

## Tecnologias Utilizadas

### Backend

- Node.js
- Fastify
- Prisma ORM
- PostgreSQL
- Zod
- JSON Web Tokens (JWT)
- Fastify Swagger + Scalar API Reference
- Mailhog para testes de e-mail em desenvolvimento

### Frontend

- Next.js
- React
- TailwindCSS
- Axios
- Next.js Middleware
- React Context para autenticação

### Testes

- Vitest
- Testcontainers
- Supertest

### Infraestrutura

- Docker
- Docker Compose
- PostgreSQL
- Mailhog

---

## Pré-requisitos

Antes de executar o projeto, verifique se você tem instalado:

- `git`
- `Node.js` (recomenda-se versão 18+)
- `npm`
- `Docker`
- `Docker Compose`

## Guia Rápido (pós-clonar)

Execute estes comandos logo após clonar o repositório para subir a aplicação em modo de desenvolvimento e rodar os testes.

1. Clonar o repositório e entrar na pasta:

```bash
git clone git@github.com:raphaeldamasceno07/desafio-fullstack.git
cd desafio-fullstack
```

2. Instalar dependências (monorepo):

```bash
npm install
```

3. Copiar arquivos de ambiente e ajustar as variáveis (backend):

```bash
cp apps/api/.env.example apps/api/.env
# (Opcional) copie o .env do web se existir
cp apps/web/.env.example apps/web/.env || true
# Edite apps/api/.env e defina POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, DATABASE_URL e JWT_SECRET
```

4. Subir infraestrutura (Postgres, Mailhog) e a API/Web com Docker Compose:

```bash
docker compose up -d
```

5. Aplicar migrações do Prisma (gera schema e tabelas):

```bash
cd apps/api
npm run prisma:migrate
```

6. Abrir a aplicação:

- Frontend: http://localhost:3000
- API: http://localhost:3333
- Scallar Doc: http://localhost:3333

7. Comandos úteis de desenvolvimento (alternativas):

```bash
# Ver logs da API via script do monorepo
npm run dev:api

# Rodar apenas o frontend em dev
npm run dev:web
```

8. Rodar os testes rapidamente:

```bash
# Testes unitários do backend
npm run test

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:coverage
```

Nota importante para E2E:

- Na primeira vez que for rodar os testes E2E, gere o client do Prisma dentro da pasta `apps/api`:

```bash
cd apps/api
npx prisma generate
```

- As variáveis de ambiente do banco devem estar configuradas (em `apps/api/.env`). Certifique-se de definir **POSTGRES_DB** como abaixo para os testes E2E:

```
POSTGRES_DB=fullstack-challenge-db
```

---

## Como Executar o Projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o template de ambiente para o backend:

```bash
cp apps/api/.env.example apps/api/.env
```

Edite `apps/api/.env` com os valores corretos para:

- `POSTGRESQL_USERNAME`
- `POSTGRESQL_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL`
- `JWT_SECRET`

> O frontend usa `NEXT_PUBLIC_API_URL=http://localhost:3333` por padrão. Se usar o `docker compose` embutido, essa configuração já está definida no serviço `web`.

### 3. Subir infraestrutura com Docker Compose

```bash
docker compose up -d
```

Isso inicializa:

- `db` (PostgreSQL)
- `api` (Fastify)
- `web` (Next.js)
- `mailhog`

### 4. Aplicar migrações do Prisma

```bash
npm run prisma:migrate
```

### 5. Acessar a aplicação

- Frontend: `http://localhost:3000`
- API: `http://localhost:3333`

---

## Como Executar os Testes

A suíte de testes E2E é executada no backend com Vitest e Testcontainers:

```bash
npm run test:e2e
```

Para rodar em modo watch:

```bash
npm run test:e2e:watch
```

---

## Documentação da API

A documentação gerada está disponível enquanto o backend estiver rodando em:

```text
http://localhost:3333/docs
```

Lá você encontrará os endpoints expostos, contratos de request/response e exemplos de uso.

---

## Próximos Passos / Melhorias Futuras

- Adicionar controle de roles e permissões no backend
- Implementar cache em camada de API para consultas de filmes
- Adicionar SSR/SSG em partes do frontend para melhorar SEO e performance
- Integrar pipelines de CI/CD com testes e validação de qualidade
- Expandir o painel de administração para gerenciar filmes, usuários e estatísticas

---

## Observações

Este projeto foi estruturado para ser uma base robusta de arquitetura Fullstack, com foco em segurança, modularidade e facilidade de desenvolvimento.
