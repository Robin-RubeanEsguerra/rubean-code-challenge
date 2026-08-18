#!/bin/sh
set -e

echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
until php -r 'exit(@fsockopen(getenv("DB_HOST"), (int) (getenv("DB_PORT") ?: 5432), $errno, $errstr, 2) ? 0 : 1);'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is up"

rm -f /var/www/html/database/database.sqlite

php <<'PHP'
<?php
$path = '/var/www/html/.env';
$env = file_exists($path) ? file_get_contents($path) : '';
$map = [
    'DB_CONNECTION' => getenv('DB_CONNECTION') ?: 'pgsql',
    'DB_HOST' => getenv('DB_HOST') ?: 'database',
    'DB_PORT' => getenv('DB_PORT') ?: '5432',
    'DB_DATABASE' => getenv('DB_DATABASE') ?: 'code-challenge-db',
    'DB_USERNAME' => getenv('DB_USERNAME') ?: 'postgres',
    'DB_PASSWORD' => getenv('DB_PASSWORD') ?: 'postgres',
    'SEARCHER_URL' => getenv('SEARCHER_URL') ?: 'http://searcher:9200',
    'APP_URL' => getenv('APP_URL') ?: 'http://localhost',
];
foreach ($map as $key => $value) {
    $line = $key.'='.$value;
    $pattern = '/^#?\s*'.preg_quote($key, '/').'=.*$/m';
    if (preg_match($pattern, $env)) {
        $env = preg_replace($pattern, $line, $env);
    } else {
        $env .= PHP_EOL.$line;
    }
}
file_put_contents($path, $env);
PHP

php artisan config:clear --no-interaction

if [ -z "${APP_KEY}" ]; then
  php artisan key:generate --force --no-interaction
fi

php artisan migrate --force --no-interaction

exec php artisan serve --host=0.0.0.0 --port=8001
