<?php
/**
 * OJS config template.
 *
 * Rendered to config.inc.php at container startup by docker-entrypoint.sh.
 * Values are substituted from environment variables so no secrets live
 * in the image or in version control.
 */

return array(
    'general' => array(
        'base_url' => getenv('OJS_BASE_URL') ?: 'http://localhost',
        'enable_cdn' => false,
        'installed' => false,
        'time_zone' => 'UTC',
    ),
    'database' => array(
        'driver' => 'mysqli',
        'host' => getenv('OJS_DB_HOST') ?: 'localhost',
        'port' => getenv('OJS_DB_PORT') ?: '3306',
        'username' => getenv('OJS_DB_USER') ?: 'root',
        'password' => getenv('OJS_DB_PASSWORD') ?: '',
        'name' => getenv('OJS_DB_NAME') ?: 'ojs',
        // Aiven MySQL requires SSL.
        'ssl' => array(
            'enable' => true,
            'cipher' => '',
        ),
    ),
    'oai' => array(
        'repository_id' => 'njpst',
        'enable_oai' => true,
    ),
    'api' => array(
        // Enables REST API token generation in the user profile.
        'api_key_secret' => getenv('OJS_API_SECRET') ?: 'change-me-in-production',
    ),
    'email' => array(
        'default_envelope_sender' => getenv('OJS_SMTP_FROM') ?: '',
        'force_envelope_sender' => true,
        'smtp' => array(
            'smtp_server' => getenv('OJS_SMTP_HOST') ?: '',
            'smtp_port' => getenv('OJS_SMTP_PORT') ?: 587,
            'smtp_auth' => getenv('OJS_SMTP_AUTH') ?: 'LOGIN',
            'smtp_username' => getenv('OJS_SMTP_USER') ?: '',
            'smtp_password' => getenv('OJS_SMTP_PASS') ?: '',
            'smtp_secure' => getenv('OJS_SMTP_SECURE') ?: 'tls',
        ),
    ),
    'i18n' => array(
        'locale' => 'en',
        'client_charset' => 'utf-8',
    ),
);
