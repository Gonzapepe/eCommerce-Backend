# Casa Bianco Backend

Backend of Casa Bianco's webpage.

## Running Migrations

To run the migrations, do the following:

```bash
npm run typeorm migration:generate -- -n NameOfTheMigration
```

And ensure you have synchronize set to false in ormconfig.ts

# .env Variables needed

- NODE_ENV
- PORT
- PG_PORT
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- JWT_SECRET

# Commits

Commits must meet [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
