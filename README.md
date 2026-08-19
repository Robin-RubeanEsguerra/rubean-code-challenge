# Code Challenge - Customer Manager

Angular frontend and Laravel API, run together with Docker Compose.

## Services

| Service | Role |
|---|---|
| `controller` | Nginx load balancer. Serves the UI and forwards `/api` to `api`. |
| `api` | Laravel backend |
| `database` | PostgreSQL |
| `searcher` | Elasticsearch (customer search documents) |

## Run with Docker (Recommended)

**Prerequisites:** Docker Desktop

```bash
git clone https://github.com/Robin-RubeanEsguerra/rubean-code-challenge.git
cd rubean-code-challenge
docker compose up --build
```

The frontend is already set to Docker mode (`backendUrl: '/api'` in `code-challenge-fe/src/app/environments/environment.ts`).

Then open:

- App: http://localhost
- API example: http://localhost/api/customers
- Search: http://localhost/api/customers?search=Jane

Stop with `Ctrl+C`, then:

```bash
docker compose down
```

## Optional: Run Locally

**Prerequisites:** PHP, Composer, Node.js, a local PostgreSQL instance, and Docker Desktop (for Elasticsearch only).

1. Copy `code-challenge-be/.env.example` to `code-challenge-be/.env` and set:

```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=code-challenge-db
DB_USERNAME=postgres
DB_PASSWORD=
SEARCHER_URL=http://127.0.0.1:9200
```

2. In `code-challenge-fe/src/app/environments/environment.ts`, use local mode:

```ts
backendUrl: 'http://127.0.0.1:8000/api'
```

3. Start Elasticsearch:

```bash
docker compose up searcher
```

4. Start the backend:

```bash
cd code-challenge-be
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

5. Start the frontend (new terminal):

```bash
cd code-challenge-fe
npm install
ng serve --open
```

Then open:

- App: http://localhost:4200/
- API example: http://127.0.0.1:8000/api/customers
- Search: http://127.0.0.1:8000/api/customers?search=Jane
