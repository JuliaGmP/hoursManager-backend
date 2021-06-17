import {PermissionKey} from '../authorization/permission-key';

export class Utils {
  constructor() {}
  async getPermissionKey(permission: string): Promise<PermissionKey> {
    type permisionType = {
      [key: string]: string;
    };
    const permisionObject: permisionType = {
      ViewOwnUserAccount: PermissionKey.ViewOwnUser,
      CreateUserAccount: PermissionKey.CreateUser,
      UpdateOwnUserAccount: PermissionKey.UpdateOwnUser,
      DeleteOwnUserAccount: PermissionKey.DeleteOwnUser,
    };

    if (permission in permisionObject) {
      return permisionObject[permission] as PermissionKey;
    } else {
      throw new Error(`Permission not found`);
    }
  }

  async getArrayPermissionKey(
    arrayPermissions: string[],
  ): Promise<PermissionKey[]> {
    type permisionType = {
      [key: string]: string;
    };
    const auxArray: PermissionKey[] = [];
    const permisionObject: permisionType = {
      ViewOwnUser: PermissionKey.ViewOwnUser,
      CreateUser: PermissionKey.CreateUser,
      UpdateOwnUser: PermissionKey.UpdateOwnUser,
      DeleteOwnUser: PermissionKey.DeleteOwnUser,
    };

    arrayPermissions.forEach(permission => {
      if (permission in permisionObject) {
        auxArray.push(permisionObject[permission] as PermissionKey);
      } else {
        throw new Error(`Permission not found`);
      }
    });

    return auxArray;
  }
}
