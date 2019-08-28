import * as knex from "knex";

const knex_option = {
  client: "mysql",
  connection: {
    host: "localhost", // process.env.DATABASE_HOST
    user: "user", // process.env.DATABASE_USER
    password: "password", // process.env.DATABASE_PASSWORD
    database: "db" // process.env.DATABASE_DATABASE
  },
  pool: { min: 0, max: 7 }
};

export class DB {
  private db;
  constructor() {
    this.db = knex(knex_option);
  }
  async sql(sql: string, args: Array<any>): Promise<any> {
    const result: any = await this.db.raw(sql, args);
    return result;
  }
}
