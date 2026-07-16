@echo off
REM Start NJPST local PostgreSQL on port 5433
set PGDATA=C:\Users\zabdiel\njpst_local_db
set PGPORT=5433
set LOGFILE=C:\Users\zabdiel\njpst_local_db\server.log
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" start -D "%PGDATA%" -o "-p %PGPORT%" -l "%LOGFILE%"
echo Done. Postgres should now be running on port 5433.
