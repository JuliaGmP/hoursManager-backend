import { PermissionKey } from '../authorization/permission-key';
import { UserProfile } from '@loopback/security';

export interface UserPermissionsFn {
  (
    userPermissions: PermissionKey[],
    requiredPermissions: RequiredPermissions,
  ): boolean;
}

export interface RequiredPermissions {
  required: PermissionKey[];
}

//needed to perform authentication&authorization. format of the userProfile
export interface MyUserProfile extends UserProfile {
  //id: string,
  email: string;
  permissions: PermissionKey[];
}

export const UserProfileSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    userWeeklyScheduleID: {
      type: "string"
    }
    //rolesID: {
    //  type: "array",
    //  items: {
    //    type: "string"
    //  }
    //}
  },
};

//uses UserProfileSchema, for API controller
export const UserRequestBody = {
  description: 'The input of create user function',
  required: true,
  content: {
    'application/json': { schema: UserProfileSchema },
  },
};

export interface Credential {
  email: string;
  password: string;
}

