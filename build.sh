#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
composer install --no-dev --optimize-autoloader --no-interaction

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Generate optimized config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
