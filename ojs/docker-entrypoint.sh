#!/bin/bash
set -e

OJS_DIR="/var/www/html"

echo "→ Rendering OJS config.inc.php from environment variables..."

# OJS cannot read env vars at runtime, so we generate a static
# config.inc.php from the environment at container startup.
cat > "${OJS_DIR}/config.inc.php" <<EOF
<?php
return array(
    'general' => array(
        'base_url' => '${OJS_BASE_URL:-http://localhost}',
        'enable_cdn' => false,
        'installed' => false,
        'time_zone' => 'UTC',
    ),
    'database' => array(
        'driver' => 'mysqli',
        'host' => '${OJS_DB_HOST:-localhost}',
        'port' => '${OJS_DB_PORT:-3306}',
        'username' => '${OJS_DB_USER:-root}',
        'password' => '${OJS_DB_PASSWORD:-}',
        'name' => '${OJS_DB_NAME:-ojs}',
        'ssl' => array('enable' => true, 'cipher' => ''),
    ),
    'oai' => array('repository_id' => 'njpst', 'enable_oai' => true),
    'api' => array('api_key_secret' => '${OJS_API_SECRET:-change-me}'),
    'email' => array(
        'default_envelope_sender' => '${OJS_SMTP_FROM:-}',
        'force_envelope_sender' => true,
        'smtp' => array(
            'smtp_server' => '${OJS_SMTP_HOST:-}',
            'smtp_port' => '${OJS_SMTP_PORT:-587}',
            'smtp_auth' => '${OJS_SMTP_AUTH:-LOGIN}',
            'smtp_username' => '${OJS_SMTP_USER:-}',
            'smtp_password' => '${OJS_SMTP_PASS:-}',
            'smtp_secure' => '${OJS_SMTP_SECURE:-tls}',
        ),
    ),
    'i18n' => array('locale' => 'en', 'client_charset' => 'utf-8'),
);
EOF

chown www-data:www-data "${OJS_DIR}/config.inc.php"
chmod 640 "${OJS_DIR}/config.inc.php"

echo "→ OJS config written. Starting Apache..."
exec "$@"
