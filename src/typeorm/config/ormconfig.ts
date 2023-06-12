import { ConnectionOptions } from "typeorm";

const config: ConnectionOptions = {
  type: "postgres",
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false, // @see Use synchronize: false if you're running migrations, otherwise leave it in true
  migrationsRun: true, // @see if set on true, then it will run new migrations once the server is up
  logging: true, // @see Also, to generate new migrations, run "npm run typeorm migration:generate -- -n Name" After installing typeorm globally.
  entities: ["src/typeorm/entities/**/*.ts"],
  migrations: ["src/typeorm/migrations/**/*.ts"],
  subscribers: ["src/typeorm/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/typeorm/entities",
    migrationsDir: "src/typeorm/migrations",
    subscribersDir: "src/typeorm/subscriber",
  },
};

export = config;
