# Casa Bianco Backend

Backend of Casa Bianco's webpage.

## Generating Migrations

To generate the migrations, do the following:

```bash
npm run typeorm migration:generate -- -n NameOfTheMigration
```

And ensure you have synchronize set to false in ormconfig.ts

## Running Migrations

To run a migration, make sure to run the following command: `
```bash
npm run typeorm migration:run
```

This piece of code will run all pending migrations.

## .env Variables needed

- NODE_ENV
- PORT
- PG_PORT
- PG_HOST
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- JWT_SECRET
- JWT_EXPIRATION

## Commits

Commits must meet [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
