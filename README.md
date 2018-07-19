# Bettings

This is a bettings system I made to evaluate the real world usage of the 
Node.Js + TS + Express + PostgreSQL stack.

## Prerequisites
- **Yarn** or **NPM**
- **Docker** with **docker-compose** or a **PostgreSQL** server you can access.
- **Sqitch** is required to run the migrations too, but you can also
copy-and-paste the files in `migrations/deploy`, if you wish to do it manually.

Just run it, just do:
```bash
yarn
docker-compose up -d
(cd migrations && sqitch deploy)
yarn dev
```
