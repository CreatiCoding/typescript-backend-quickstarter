import { RedisACL } from "@libs/redis";
import * as Koa from "koa";

type ctx = Koa.ParameterizedContext<any, {}>;
type next = () => Promise<any>;

const ROLE_GUEST = "guest";
export class AuthMiddleware {
  constructor(private redis_acl: RedisACL) {}

  async use(ctx: ctx, next: next) {
    const { path } = ctx;
    const { method } = ctx.req;
    const { role = ROLE_GUEST } = ctx.state.user
      ? ctx.state.user
      : { role: ROLE_GUEST };
    if (!(await this.redis_acl.existAPI(path, method))) {
      ctx.throw(404, "Not Found", {
        message: "페이지를 찾을 수 없습니다."
      });
      return;
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
