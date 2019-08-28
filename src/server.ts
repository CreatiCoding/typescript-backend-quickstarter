import { Modules } from "@/modules";
import { Services } from "@/services";
import { Domains } from "@/domains";
import { Models } from "@/models";

export class Server {
  constructor(
    public modules: Modules = null,
    public services: Services = null,
    public domains: Domains = null,
    public models: Models = null
  ) {}
}
