import { Modules } from "@/modules";
import { Services } from "@/services";
import { Domains } from "@/domains";
import { Models } from "@/models";
import { Middlewares } from "@/middlewares";

import * as Koa from "koa";
import * as Router from "koa-router";
import { DB } from "@libs/db";
import { RedisACL } from "@libs/redis";

import * as acl from "@res/acl.json";

export class Server {
  private middlewares: Middlewares;
  constructor(
    private app: Koa = null,
    private router: Router = null,
    private db: DB,
    private redis_acl: RedisACL
  ) {
    const modules: Modules = new Modules(router, db);
    const services: Services = new Services("Asd");
    const domains: Domains = new Domains("Asd");
    const models: Models = new Models("Asd");
    this.middlewares = new Middlewares(redis_acl);
  }
  async run() {
    const { app, router, middlewares } = this;
    const routes = router.routes();
    const allowed_methods = router.allowedMethods();
    const PORT = 8080;

    // For acl dev
    await this.redis_acl.reset();
    if (!(await this.redis_acl.findKeys("api"))) {
      await this.redis_acl.load(acl);
    }

    app.use(middlewares.auth);
    app.use(routes);
    app.use(allowed_methods);

    app.listen(PORT, () => {
      console.log(`koa started\nhttp://localhost:${PORT}`);
    });
  }
}
