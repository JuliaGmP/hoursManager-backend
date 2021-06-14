import {Provider} from '@loopback/context';
import {PermissionKey} from '../permission-key';
import {UserPermissionsFn, RequiredPermissions} from '../../types/types';
import {intersection} from 'lodash';

/**
 * It will compare a user’s permissions and required permissions,
 * and allow the user to get access if and only if this user has all of the required permissions.
 */
export class UserPermissionsProvider implements Provider<UserPermissionsFn> {
  constructor() {}

  value(): UserPermissionsFn {
    return (userPermissions, requiredPermissions) =>
      this.action(userPermissions, requiredPermissions);
  }

  action(
    userPermissions: PermissionKey[],
    requiredPermissions: RequiredPermissions,
  ): boolean {
    return (
      intersection(userPermissions, requiredPermissions.required).length ===
      requiredPermissions.required.length
    );
  }
}
