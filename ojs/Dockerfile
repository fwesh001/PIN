# OJS 3.4 (latest stable) on PHP 8.2 + Apache
# Hybrid Headless Architecture — OJS owns editorial workflow, users,
# peer-review, and data. Next.js is the public frontend.
#
# All secrets (DB credentials, API key) are injected at runtime via
# environment variables. Nothing sensitive is baked into the image.

FROM php:8.2-apache

# ── System dependencies ──────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpng-dev \
        libjpeg-dev \
        libfreetype6-dev \
        libzip-dev \
        libicu-dev \
        libxml2-dev \
        libcurl4-openssl-dev \
        unzip \
        git \
        cron \
    && rm -rf /var/lib/apt/lists/*

# ── PHP extensions required by OJS 3.4 ───────────────────────────
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        gd \
        intl \
        zip \
        mysqli \
        pdo_mysql \
        opcache \
        xml \
        curl \
        mbstring

# ── Apache config ────────────────────────────────────────────────
# OJS requires AllowOverride All for .htaccess (clean URLs).
RUN a2enmod rewrite \
    && sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# ── Install OJS ──────────────────────────────────────────────────
# Pin to the latest 3.4.x stable release.
ENV OJS_VERSION=3.4.0-8
ENV OJS_DIR=/var/www/html

WORKDIR /tmp
RUN curl -SL "https://github.com/pkp/ojs/releases/download/${OJS_VERSION}/ojs-${OJS_VERSION}.tar.gz" -o ojs.tar.gz \
    && tar -xzf ojs.tar.gz \
    && rm ojs.tar.gz \
    && mv "ojs-${OJS_VERSION}" "${OJS_DIR}" \
    && chown -R www-data:www-data "${OJS_DIR}" \
    && chmod -R 755 "${OJS_DIR}"

# Public files + cache must be writable by the web server.
RUN mkdir -p "${OJS_DIR}/public" "${OJS_DIR}/cache" \
    && chown -R www-data:www-data "${OJS_DIR}/public" "${OJS_DIR}/cache" \
    && chmod -R 755 "${OJS_DIR}/public" "${OJS_DIR}/cache"

# ── OJS config template ──────────────────────────────────────────
# config.inc.php is generated at runtime from env vars by entrypoint.
COPY config.tmpl.inc.php "${OJS_DIR}/config.tmpl.inc.php"
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
