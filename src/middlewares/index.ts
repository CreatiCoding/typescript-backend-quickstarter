import { AuthMiddleware } from "@/middlewares/auth";
import { RedisACL } from "@libs/redis";

export class Middlewares {
  private auth_middleware: AuthMiddleware;
  constructor(private redis_acl: RedisACL) {
    this.auth_middleware = new AuthMiddleware(redis_acl);
  }
  public auth = async (ctx, next) => await this.auth_middleware.use(ctx, next);
}
