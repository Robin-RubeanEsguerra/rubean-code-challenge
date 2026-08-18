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

```bash
git clone <your-repo-url>
cd crm-online-test
docker compose up --build

Then open:
- App: http://localhost
- API example: http://localhost/api/customers
- Search: http://localhost/api/customers?search=Jane

Stop with `Ctrl+C` or docker compose down

For local mode, make it clearer:

```md
## Optional: Run Locally

1. Copy `code-challenge-be/.env.example` to `code-challenge-be/.env`
2. Update these values for local development:
    ```env
    DB_CONNECTION=pgsql
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=code-challenge-db
    DB_USERNAME=postgres
    DB_PASSWORD=
    SEARCHER_URL=http://127.0.0.1:9200
3. Update Frontend environment.ts
    backendUrl: '/api'



```md
## Optional: Run Locally

1. Copy `code-challenge-be/.env.example` to `code-challenge-be/.env`
2. Update these values for local development:

```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=code-challenge-db
DB_USERNAME=postgres
DB_PASSWORD=
SEARCHER_URL=http://127.0.0.1:9200

3. Start Elasticsearch
docker compose up searcher

4. Start backend
    cd code-challenge-be
    composer install
    copy .env.example .env
    php artisan key:generate
    php artisan migrate
    php artisan serve

5. Start frontend
    cd code-challenge-fe
    npm install
    ng serve --open

6. Update Frontend environment.ts
    backendUrl: 'http://127.0.0.1:8000/api'
