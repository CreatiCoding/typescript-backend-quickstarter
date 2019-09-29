import * as Router from "koa-router";
import { DB } from "@libs/db";

const user_list = [{ name: "김철수", age: 20 }, { name: "영희", age: 20 }];

export class UserController {
  constructor(private router: Router, private db: DB) {
    this.router.get("/user", ctx => {
      ctx.body = { status_code: 200 };
    });
    this.router.get("/user/list", ctx => {
      ctx.body = {
        status_code: 200,
        data: user_list
      };
    });
    this.router.get("/login", ctx => {
      ctx.body = { status_code: 200 };
    });
    this.router.get("/forbidden", ctx => {
      ctx.body = { status_code: 200 };
    });
  }
}
