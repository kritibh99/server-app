import { User } from "./user.model";
import { userOperations } from "./useroperation";
export class usersOperations {
  user: userOperations;

  capitalize(param: string) {
    return param.charAt(0).toUpperCase() + param.slice(1).toLowerCase();
  }
  constructor(user: userOperations) {
    this.user = user;
  }
}
