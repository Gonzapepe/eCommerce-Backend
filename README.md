# Casa Bianco Backend

Backend of Casa Bianco's webpage.

## Running Migrations

To run the migrations, do the following:

```bash
npm run typeorm migration:generate -- -n NameOfTheMigration
```

And ensure you have synchronize set to false in ormconfig.ts
