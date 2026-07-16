@echo off
REM Stop NJPST local PostgreSQL on port 5433
set PGDATA=C:\Users\zabdiel\njpst_local_db
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" stop -D "%PGDATA%" -m fast
echo Done. Postgres stopped.
