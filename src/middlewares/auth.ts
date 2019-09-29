import { RedisACL } from "@libs/redis";
import * as Koa from "koa";

type ctx = Koa.ParameterizedContext<any, {}>;
type next = () => Promise<any>;

const ROLE_GUEST = "guest";
export class AuthMiddleware {
  constructor(private redis_acl: RedisACL, private public_list: String[]) {}

  async use(ctx: ctx, next: next) {
    const { path } = ctx;
    const { method } = ctx.req;
    const { role } = ctx.state.user || { role: ROLE_GUEST };

    if (this.public_list && this.public_list.indexOf(path) !== -1) {
      return await next();
    }

    if (!(await this.redis_acl.isAllow(role, path, method))) {
      if (role === ROLE_GUEST) {
        ctx.throw(401, "Unauthorized", {
          message: "로그인이 필요합니다.",
          path: "/login"
        });
        return;
      } else {
        ctx.throw(403, "Forbidden", {
          message: "인가되지 않은 요청입니다.",
          path: "/forbidden"
        });
        return;
      }
    }
    await next();
    return;
  }
}
