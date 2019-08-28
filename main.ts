import { Modules } from "@/modules";
import { Services } from "@/services";
import { Domains } from "@/domains";
import { Models } from "@/models";
import { Server } from "@/server";
import { DB } from "@/libs/db";

const server = new Server(
  new Modules("asd"),
  new Services("asd"),
  new Domains("asd"),
  new Models("asd")
);

console.log(server);
console.log(server.modules);

const db = new DB();
console.log(db);
