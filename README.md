# Casa Bianco Backend

Backend of eCommerce's webpage.

## Getting started
First, you need to clone the repository:

https:
```bash
git clone https://github.com/Gonzapepe/eCommerce-Backend.git ecommerce
```
Or if you have a public SSH Key
```bash
git clone git@github.com:Gonzapepe/eCommerce-Backend.git ecommerce
```

Then, you need to install all the dependencies needed for the project to work properly by running the following script:

```bash
npm i
```
Once all these steps are finished, now you need to complete the following environment variables listed below :point_down:

## .env Variables needed

- NODE_ENV = Needed for the processEnv.d.ts dev by default
- PORT = the Port used for the express server
- PG_PORT = port of the postgres database
- PG_HOST = host of the database. localhost by default
- POSTGRES_USER = postgres user
- POSTGRES_PASSWORD = password of the postgres user
- POSTGRES_DB = name of the database
- JWT_SECRET = a random string
- JWT_EXPIRATION = the expiration time of the tokens


## Generating Migrations

To generate the migrations, do the following:

```bash
npm run typeorm migration:generate -- -n NameOfTheMigration
```

And ensure you have synchronize set to false in ormconfig.ts

## Running Migrations

To run a migration, make sure to run the following command: 
```bash
npm run typeorm migration:run
```

This piece of code will run all pending migrations.


## Commits

Commits must meet [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
