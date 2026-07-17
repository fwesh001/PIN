# Deploy OJS 3.4 to pxxl.app

OJS (Open Journal Systems) is the backend for the NJPST hybrid architecture.
It owns all editorial workflow, users, peer-review, and data. The Next.js
frontend (repo root) talks to OJS via its REST API.

pxxl.app was chosen because it natively supports **PHP**, **MySQL**, and
container **storage** (for uploaded manuscripts) — all on one service.

## What's in this folder

| File | Purpose |
|------|---------|
| `Dockerfile` | OJS 3.4 on PHP 8.2 + Apache. Reads DB config from env vars. |
| `config.tmpl.inc.php` | OJS `config.inc.php` template (env-driven). |
| `docker-entrypoint.sh` | Generates `config.inc.php` at startup, then launches Apache. |

## Prerequisites (done in pxxl dashboard)

1. A **MySQL database** named e.g. `Pin` (pxxl → Create Database → MySQL).
2. Note its **host, port, user, password, database name**.
3. A pxxl **project** linked to this GitHub repo (`PIN`).

## Deploy steps (pxxl dashboard)

1. **New Project** → import the `PIN` repo.
2. pxxl auto-detects the framework from `ojs/Dockerfile`. If prompted, set:
   - **Runtime:** Docker
   - **Root directory:** `ojs`
   - **Build:** (uses the Dockerfile)
   - **Start:** Apache starts inside the container (`apache2-foreground`)
3. **Add Environment Variables** (Settings → Environment):

   | Key | Value |
   |-----|-------|
   | `OJS_BASE_URL` | `https://<your-ojs-subdomain>.pxxl.pro` |
   | `OJS_DB_HOST` | pxxl MySQL host |
   | `OJS_DB_PORT` | pxxl MySQL port (usually `3306` or as shown) |
   | `OJS_DB_USER` | pxxl MySQL user |
   | `OJS_DB_NAME` | `Pin` (your DB name) |
   | `OJS_DB_PASSWORD` | pxxl MySQL password ⚠️ secret |
   | `OJS_API_SECRET` | a long random string ⚠️ secret (enables REST API tokens) |
   | `OJS_SMTP_*` | optional — for transactional email |

   > The `OJS_DB_*` values come from the pxxl MySQL database you created,
   > NOT the Aiven MySQL in `.env` (that was for the Render plan). Use the
   > pxxl "Pin" database credentials here.

4. **Deploy.** pxxl builds the image and starts Apache.
5. Open the project URL — OJS **web installer** appears.
6. Complete the install:
   - Database: the `OJS_DB_*` values above (MySQL, SSL if required).
   - Create the **admin user**.
   - Create the **journal** (NJPST).
7. In the OJS user profile, generate a **REST API key**.

## Wire the frontend

Once OJS is live, update the repo root `.env`:

```dotenv
OJS_API_URL="https://<your-ojs-subdomain>.pxxl.pro/api/v1"
OJS_BASE_URL="https://<your-ojs-subdomain>.pxxl.pro"
NEXT_PUBLIC_OJS_URL="https://<your-ojs-subdomain>.pxxl.pro"
OJS_API_KEY="<api-key-from-ojs-profile>"
```

Then rebuild the Next.js app (`npm run build`) — it will now fetch real
submissions/issues from OJS.

## Notes

- OJS writes uploaded PDFs to `/var/www/html/public` inside the container.
  pxxl's container storage persists these across deploys.
- OJS requires **MySQL/MariaDB** — do NOT use pxxl PostgreSQL for OJS.
- The `OJS_API_SECRET` must be a stable random string; changing it
  invalidates existing API keys.
