import { UserModel } from "@/models/user/user";

export class Models {
  constructor(private greeting: string) {}
  greet() {
    return "Hello, " + this.greeting;
  }
}
