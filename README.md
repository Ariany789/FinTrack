# FinTrack

Aplicação full stack de controle de finanças pessoais, com dashboard de dados, transações, categorias, orçamentos, relatórios e insights. Não há autenticação nesta versão: a aplicação abre diretamente no dashboard.

## Tecnologias

- Frontend: React, TypeScript, Vite, Tailwind CSS, TanStack Query, Recharts e Lucide.
- Backend: FastAPI, SQLAlchemy 2.x, Pydantic 2.x, Alembic e SQLite.
- Qualidade: Pytest, Ruff e GitHub Actions.

## Estrutura

```text
fintrack/
├── backend/       # API, migrations, seed e testes
├── frontend/      # Interface React responsiva
├── .github/       # pipeline CI
├── docker-compose.yml
└── ARCHITECTURE.md
```

## Executar localmente

### Início com um clique (Windows)

Após copiar a pasta para outra máquina, instale uma única vez o Python 3.12+ e o Node.js LTS. Em seguida, dê duplo clique em `INICIAR_FINTRACK.bat` na raiz do projeto. O script prepara as dependências na primeira execução, aplica as migrations, inicia os dois serviços e abre `http://127.0.0.1:5173` automaticamente.

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

API e Swagger: `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`. Copie os arquivos `.env.example` para `.env` se precisar mudar as URLs padrão.

## Banco, migrations e seed

O banco local é `backend/fintrack.db` e fica ignorado pelo Git. Execute `alembic upgrade head` numa máquina nova. O comando `python -m app.seed` cria categorias, transações e orçamentos demonstrativos sem dados pessoais.

## API

Base: `/api/v1`. Inclui health check, CRUD de transações e categorias, orçamento, dashboard, relatórios e insights. A documentação interativa está no Swagger.

## Docker

```bash
docker compose up --build
```

O frontend é servido pelo Nginx e encaminha as chamadas `/api` ao backend. Os dados SQLite são persistidos no volume `fintrack-data`.

## CI/CD

O workflow em `.github/workflows/ci.yml` instala dependências, executa Ruff e Pytest no backend e valida build TypeScript/Vite no frontend.

## Distribuição Windows

O projeto pode gerar uma pasta autocontida para instalação pelo Inno Setup. O usuário final não precisa ter Python, Node.js, npm ou banco de dados instalados.

```bash
npm install
python -m pip install -r backend/requirements-build.txt
npm run dist
```

O comando cria `dist/FINTRACK/`. Use essa pasta como origem no Inno Setup. O executável principal é `dist/FINTRACK/FINTRACK.exe`; ele inicia o backend local e abre a interface automaticamente.

Os dados do usuário são mantidos em `%AppData%\FINTRACK`, separados dos arquivos instalados. Na primeira abertura, o banco SQLite é criado, as migrations são aplicadas e os dados demonstrativos são incluídos. Logs de diagnóstico ficam no mesmo diretório.

Consulte `desktop/INNO_SETUP.md` para o processo de manutenção e empacotamento.

## Roadmap

- Exportação de relatórios.
- Testes de interface.
- Comparação de períodos no dashboard.
