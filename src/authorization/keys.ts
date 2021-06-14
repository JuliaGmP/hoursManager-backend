import {BindingKey} from '@loopback/context';
import {UserPermissionsFn} from '../types/types';
import {TokenService} from '@loopback/authentication';
/**
 * Binding keys used by this component.
 */

//self-defined component needed to bind to application.ts
export namespace MyAuthBindings {
  export const USER_PERMISSIONS = BindingKey.create<UserPermissionsFn>(
    'userAuthorization.actions.userPermissions',
  );

  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

//value used in token service
export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'en&ZX^qnT&dk';
  export const TOKEN_EXPIRES_IN_VALUE = '5000h';
}
