import { Server } from "@/server";
import * as Koa from "koa";
import * as Router from "koa-router";
import { DB } from "@libs/db";
import { RedisACL } from "@libs/redis";

const server = new Server(
  new Koa(),
  new Router(),
  new DB(),
  new RedisACL("1234")
);

server.run();
