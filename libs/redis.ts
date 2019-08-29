import { RedisClient, createClient } from "redis";

const API = "api";

export class RedisACL {
  private client: RedisClient;
  constructor(private password: string) {
    this.client = createClient({ password });
  }

  async reset() {
    return new Promise((resolve, reject) => {
      this.client.flushdb((err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async load(acl) {
    const promise_list = [];
    Object.keys(acl).forEach(key => {
      acl[key].forEach(access_control => {
        const [access_path, access_method] = access_control.split(":");
        promise_list.push(this.addAPI(access_path, access_method));
        promise_list.push(this.addACL(key, access_path, access_method));
      });
    });
    return Promise.all(promise_list);
  }

  async findKeys(key_pattern: string) {
    return new Promise(resolve => {
      this.client.keys(key_pattern, (err, reply_list) => {
        if (err || reply_list.length === 0) {
          return resolve(false);
        } else {
          return resolve(reply_list);
        }
      });
    });
  }

  async addAPI(access_path: string, access_method: string) {
    return new Promise(resolve => {
      this.client.sadd(API, `${access_path}:${access_method}`, (err, reply) => {
        if (err) {
          return resolve(false);
        } else {
          return resolve(reply !== 0);
        }
      });
    });
  }
  async existAPI(access_path: string, access_method: string) {
    if (await this.isEmpty(API)) {
      return false;
    }
    return new Promise(resolve => {
      this.client.sismember(
        API,
        `${access_path}:${access_method}`,
        (err, reply) => {
          if (err) {
            return resolve(false);
          } else {
            return resolve(reply !== 0);
          }
        }
      );
    });
  }
  async isAllow(role_name: string, access_path: string, access_method: string) {
    if (await this.isEmpty(role_name)) {
      return false;
    }

    return new Promise(resolve => {
      this.client.sismember(
        role_name,
        `${access_path}:${access_method}`,
        (err, reply) => {
          if (err) {
            return resolve(false);
          } else {
            return resolve(reply !== 0);
          }
        }
      );
    });
  }

  async findRoleList() {
    return new Promise(resolve => {
      this.client.keys("*", (err, reply_list) => {
        resolve(reply_list);
      });
    });
  }

  async findACLList(role_name) {
    if (await this.isEmpty(role_name)) {
      return [];
    }

    return new Promise(resolve => {
      this.client.smembers(role_name, (err, reply_list) => {
        resolve(reply_list);
      });
    });
  }

  async addACL(role_name: string, access_path: string, access_method: string) {
    if (!(await this.existAPI(access_path, access_method))) {
      await this.addAPI(access_path, access_method);
    }
    return new Promise(resolve => {
      this.client.sadd(
        role_name,
        `${access_path}:${access_method}`,
        (err, reply) => {
          if (err) {
            return resolve(false);
          } else {
            return resolve(reply !== 0);
          }
        }
      );
    });
  }

  async removeACL(
    role_name: string,
    access_path: string,
    access_method: string
  ) {
    if (await this.isEmpty(role_name)) {
      return false;
    }

    return new Promise(resolve => {
      this.client.srem(
        role_name,
        `${access_path}:${access_method}`,
        (err, reply) => {
          if (err) {
            return resolve(false);
          } else {
            return resolve(reply !== 0);
          }
        }
      );
    });
  }

  async isEmpty(role_name) {
    return new Promise(resolve => {
      this.client.smembers(role_name, (err, reply_list) => {
        if (err || !reply_list || reply_list.length === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async removeRole(role_name: string) {
    return new Promise(resolve => {
      this.client.del(role_name, (err, reply) => {
        if (err || !reply) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
