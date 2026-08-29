import { User } from "src/user/entities/user.entity";
import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/browser";
import { config } from "dotenv"

config({ path: ".env" })

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    url: process.env.DB_URL,
    entities: [User],
    migrations: ["dist/db/migrations/*.js"]
}

export const dataSource = new DataSource(dataSourceOptions);