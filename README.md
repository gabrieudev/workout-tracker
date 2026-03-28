<h1 align="center" style="font-weight: bold;">Workout Tracker API</h1>

<p align="center">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun">
  <img src="https://img.shields.io/badge/elysia-%23000000.svg?style=for-the-badge&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI%2FPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI%2BCjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMzIwLjAwMDAwMHB0IiBoZWlnaHQ9IjMyMC4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDMyMC4wMDAwMDAgMzIwLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMzIwLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTE0MDggMjkxMyBjLTIxIC0yIC0zOCAtNiAtMzggLTkgMCAtOSA4MyAtMTA5IDEwMiAtMTIyIDEwIC04IDU2Ci0yOCAxMDIgLTQ2IDE2OSAtNjcgMjQyIC0xNDYgMjk0IC0zMjEgMzMgLTEwOSA2NyAtMTU0IDE2OCAtMjIxIDQ5IC0zMyAxMTMKLTcwIDE0MiAtODMgMjggLTE0IDUyIC0yOCA1MiAtMzEgMCAtNDMgLTE2OCAtMTM0IC0zMTAgLTE2OSAtNDYgLTEyIC0xMjggLTI0Ci0xODEgLTI4IGwtOTYgLTYgMjQgLTQzIGMzMyAtNTkgNDYgLTE4OCAyOSAtMjc1IC0xMSAtNTIgLTE5IC02OCAtNDcgLTg5IC0xOAotMTQgLTcyIC01OCAtMTE5IC05OCAtMTE1IC05OCAtMjMwIC0xNTEgLTI2NSAtMTIyIC0yMSAxOCAtMTkgOTQgNCAxMzkgMTEgMjEKMzYgNTIgNTUgNjkgMjAgMTcgMzYgMzYgMzYgNDEgMCAxNiAtMTMwIDM0IC0yMDkgMjggLTk2IC03IC0yNDMgLTU1IC0zMzYKLTEwOSAtMTAxIC02MCAtMjIxIC0xODQgLTI2NyAtMjc4IC00OCAtOTggLTY3IC0xNzIgLTc0IC0yOTUgLTEwIC0xNjEgMjIKLTI3NyAxMDIgLTM2NSA2MCAtNjcgMTkyIC0xNjggMjY1IC0yMDUgODMgLTQyIDE5NSAtNzEgMzQ3IC05MCAyMTQgLTI3IDM2MgotMTMgNTUyIDUyIDE4MyA2MiAzMDcgMTMzIDQ4NyAyNzkgOTQgNzYgMTA4IDg0IDE0NyA4NCAzMyAwIDQ4IC02IDY4IC0yOCAxNQotMTUgMzAgLTM5IDMzIC01NCAxMiAtNDcgLTIxIC0xMjMgLTgyIC0xODggLTMwIC0zMyAtNTIgLTYwIC00OSAtNjAgNDAgMCAyMDEKMTI1IDMwNyAyMzcgMTg5IDIwMSAzMTMgNDUwIDM2NSA3MjggMjUgMTMyIDI1IDM3MiAxIDUwNSAtOTUgNTE0IC00NjkgOTQ1Ci05NjQgMTEwOSAtMTU1IDUyIC0yMjQgNjMgLTQyMyA2NiAtMTAyIDEgLTIwMiAxIC0yMjIgLTJ6Ii8%2BCjxwYXRoIGQ9Ik02MzkgMjU1NCBjLTIzNiAtMjE2IC0zODUgLTQ3NyAtNDUwIC03ODcgLTI3IC0xMjcgLTMyIC0zNzUgLTkgLTUxMgpsMTQgLTkwIDggMTE1IGMxOSAzMDkgMTYyIDU2MyAzOTUgNzA3IDU1IDMzIDU2IDM1IDIzIDMwIC0xOSAtMyAtNjIgLTkgLTk1Ci0xMiAtNTEgLTUgLTU3IC00IC00MSA3IDEwOSA3NiAxMjcgOTMgMTc4IDE3MCA1MSA3NiAxMTEgMTQyIDE1MiAxNjUgMTUgOCAxMQoxNyAtMjggNzcgLTI1IDM3IC01NCA5NCAtNjQgMTI4IGwtMTkgNjEgLTY0IC01OXoiLz4KPHBhdGggZD0iTTE1MzAgMjQxNyBjMCAtMjAgNDAgLTc3IDcwIC05OSAxNCAtMTAgNTAgLTIxIDgwIC0yNCBsNTUgLTUgLTU4IDMyCmMtMzIgMTggLTc4IDUwIC0xMDMgNzIgLTI3IDI0IC00NCAzMyAtNDQgMjR6Ii8%2BCjwvZz4KPC9zdmc%2BCg%3D%3D" alt="Elysia">
  <img src="https://img.shields.io/badge/Better%20Auth-FFFFFF?style=for-the-badge&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI%2FPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI%2BCjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMjI1LjAwMDAwMHB0IiBoZWlnaHQ9IjIyNS4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDIyNS4wMDAwMDAgMjI1LjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMjI1LjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTMxMCAxMTIwIGwwIC01ODAgMTk1IDAgMTk1IDAgMCAxOTAgMCAxOTAgMjIwIDAgMjIwIDAgMCAtMTkwIDAKLTE5MCAzOTUgMCAzOTUgMCAwIDU4MCAwIDU4MCAtMzk1IDAgLTM5NSAwIDAgLTE4NSAwIC0xODUgLTIyMCAwIC0yMjAgMCAwCjE4NSAwIDE4NSAtMTk1IDAgLTE5NSAwIDAgLTU4MHogbTEyMTAgNSBsMCAtMjA1IC0xOTAgMCAtMTkwIDAgMCAyMDUgMCAyMDUKMTkwIDAgMTkwIDAgMCAtMjA1eiIvPgo8L2c%2BCjwvc3ZnPgo%3D&logoColor=C5F74F" alt="BetterAuth">
  <img src="https://img.shields.io/badge/Drizzle-%23000000?style=for-the-badge&logo=drizzle&logoColor=C5F74F" alt="Drizzle">
  <img src="https://img.shields.io/badge/biome-%2360A5FA.svg?style=for-the-badge&logo=biome&logoColor=white" alt="Biome">
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">
  <img src="https://img.shields.io/badge/openapiinitiative-%23000000.svg?style=for-the-badge&logo=openapiinitiative&logoColor=white" alt="OpenAPI">
</p>

<p align="center">
 <a href="https://workout-tracker-server-l6xm.onrender.com/docs">Acessar documentação</a> • 
 <a href="#estrutura">Estrutura do projeto</a> • 
 <a href="#inicio">Primeiros Passos</a> • 
 <a href="#interacao">Interação</a> •
 <a href="#contribuir">Contribuir</a>
</p>

<p align="center">
  <b>Workout Tracker é uma API que permite que os usuários criem treinos compostos de vários exercícios. Para cada treino, o usuário poderá atualizá-lo e fornecer comentários sobre ele. O cronograma que o usuário cria é associado a uma data específica, e qualquer listagem de exercícios ativos ou pendentes também é classificada por data. Também há um relatório de treinos passados, mostrando a porcentagem de treinos terminados durante o período consultado.
  </b>
</p>

<h2 id="estrutura">📂 Estrutura do projeto</h2>

```yaml
├── src/                        # Código-fonte da aplicação
│   ├── application/            # Regras de aplicação
│   │   └── use-cases/          # Implementações dos casos de uso
│   ├── domain/                 # Núcleo da regra de negócio
│   ├── infra/                  # Camada de infraestrutura
│   │   ├── auth/               # Autenticação (Better Auth)
│   │   ├── db/                 # Configuração e acesso ao banco (Drizzle)
│   │   └── repositories/       # Implementações de repositórios Drizzle
│   ├── presentation/           # Camada de interface com o mundo externo
│   │   └── http/               # Entrada via HTTP
│   │       ├── middlewares/    # Middlewares da API
│   │       └── routes/         # Rotas/endpoints
│   ├── main/                   # Inicialização da aplicação
│   └── index.ts                # Ponto de entrada principal
├── build.ts                    # Script de build e criação de arquivo binário
├── Dockerfile                  # Imagem da aplicação
├── docker-compose.yml          # Orquestração dos serviços (API + Postgres + Redis)
```

<h2 id="inicio">🚀 Primeiros Passos</h2>

<h3>Pré-requisitos</h3>

- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

<h3>Clonando</h3>

```bash
git clone https://github.com/gabrieudev/workout-tracker.git
```

<h3>Variáveis de Ambiente</h3>

Crie um arquivo `.env` na raiz do projeto com a seguinte variável:

```bash
BETTER_AUTH_SECRET=SECRET
```

> A secret deve ser uma string gerada em base64, você pode utilizar os seguintes comandos:

Linux

```bash
openssl rand -base64 32
```

Windows

```bash
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Max 256 }))
```

<h3>Inicializando</h3>

Execute o seguinte comando na raiz do projeto:

```bash
docker compose up -d --build
```

<h2 id="interacao">🌐 Interação</h2>

Agora, você poderá interagir com a aplicação da seguinte forma:

- Documentação: [http://localhost:3000/docs](http://localhost:3000/docs)

<h2 id="contribuir">📫 Contribuir</h2>

Contribuições são muito bem vindas! Caso queira contribuir, faça um fork do repositório e crie um pull request.

1. `git clone https://github.com/gabrieudev/workout-tracker.git`
2. `git checkout -b feature/NOME`
3. Siga os padrões de commits.
4. Abra um Pull Request explicando o problema resolvido ou a funcionalidade desenvolvida. Se houver, anexe screenshots das modificações visuais e aguarde a revisão!