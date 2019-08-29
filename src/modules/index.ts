import { UserController } from "@/modules/user";
import * as Router from "koa-router";
import { DB } from "@libs/db";

export class Modules {
  constructor(private router: Router, private db: DB) {
    const user_controller = new UserController(router, db);
  }
}
