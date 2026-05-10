# Music Tracker

A REST API for music tracking integrated with Last.fm, featuring JWT authentication and an HTML/CSS/TypeScript frontend.


<img width="800" height="423" alt="trackly" src="https://github.com/user-attachments/assets/b5672858-af87-465f-a78b-09afa6c7c495" />




## Stack

- **Backend:** Node.js + Fastify + TypeScript
- **Database:** PostgreSQL (Neon) + Prisma ORM
- **Frontend:** HTML + CSS + TypeScript
- **Auth:** JWT + bcrypt
- **Integration:** Last.fm API

## API Routes

### Auth

| Method | Route             | Description             | Auth |
| ------ | ----------------- | ----------------------- | ---- |
| POST   | `/auth/register`  | Create account          | ❌   |
| POST   | `/auth/login`     | Login                   | ❌   |
| GET    | `/me`             | Logged user data        | ✅   |
| PATCH  | `/me`             | Update Last.fm username | ✅   |
| GET    | `/me/now-playing` | Currently playing track | ✅   |
| GET    | `/me/stats`       | Top artists and tracks  | ✅   |

### Last.fm Public

| Method | Route                          | Description          | Auth |
| ------ | ------------------------------ | -------------------- | ---- |
| GET    | `/users/:username/info`        | Any user info        | ✅   |
| GET    | `/users/:username/now-playing` | Any user now playing | ✅   |

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run migrations
npx prisma migrate dev

# Start server
npx tsx src/server.ts

# Compile frontend (another terminal)
npm run watch:frontend
```

## Environment Variables

```env
PORT=3000
JWT_SECRET=
DATABASE_URL=
LASTFM_API_KEY=
```

## Roadmap

- [ ] **Last.fm OAuth** — replace manual username linking with the official Last.fm OAuth flow for secure authentication and session access
- [ ] **Deploy** — publish the backend on Railway and configure the callback URL for OAuth
- [ ] **Discord Rich Presence** — desktop app that displays the currently playing track in Discord status via Last.fm
- [ ] **Embed Widget** — endpoint returning SVG/HTML with the current track, embeddable in GitHub READMEs, websites and Notion
- [ ] **Listening History** — endpoint to list the user's recent tracks
- [ ] **Public Profile** — public page accessible without login to share the user's profile

### Portuguese Description

# Music Tracker

API REST para rastreamento de músicas integrada ao Last.fm, com autenticação JWT e frontend em HTML/CSS/TypeScript.

## Stack

- **Backend:** Node.js + Fastify + TypeScript
- **Banco de dados:** PostgreSQL (Neon) + Prisma ORM
- **Frontend:** HTML + CSS + TypeScript
- **Auth:** JWT + bcrypt
- **Integração:** Last.fm API

## Rotas da API

### Auth

| Método | Rota              | Descrição                  | Auth |
| ------ | ----------------- | -------------------------- | ---- |
| POST   | `/auth/register`  | Criar conta                | ❌   |
| POST   | `/auth/login`     | Login                      | ❌   |
| GET    | `/me`             | Dados do usuário logado    | ✅   |
| PATCH  | `/me`             | Atualizar Last.fm username | ✅   |
| GET    | `/me/now-playing` | Música tocando agora       | ✅   |
| GET    | `/me/stats`       | Top artistas e músicas     | ✅   |

### Last.fm público

| Método | Rota                           | Descrição                       | Auth |
| ------ | ------------------------------ | ------------------------------- | ---- |
| GET    | `/users/:username/info`        | Info de qualquer usuário        | ✅   |
| GET    | `/users/:username/now-playing` | Now playing de qualquer usuário | ✅   |

## Rodando localmente

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar migrations
npx prisma migrate dev

# Iniciar servidor
npx tsx src/server.ts

# Compilar frontend (outro terminal)
npm run watch:frontend
```

## Variáveis de ambiente

```env
PORT=3000
JWT_SECRET=
DATABASE_URL=
LASTFM_API_KEY=
```

## Roadmap

- [ ] **OAuth Last.fm** — substituir o vínculo manual de username pelo fluxo OAuth oficial do Last.fm, permitindo autenticação segura e acesso à sessão do usuário
- [ ] **Deploy** — publicar o backend no Railway e configurar URL de callback para o OAuth
- [ ] **Discord Rich Presence** — app desktop que exibe a música tocando agora no status do Discord via Last.fm
- [ ] **Widget embed** — endpoint que retorna SVG/HTML com a música atual, para usar em README do GitHub, sites e Notion
- [ ] **Histórico de músicas** — endpoint para listar músicas recentes do usuário
- [ ] **Perfil público** — página pública acessível sem login para compartilhar o perfil
