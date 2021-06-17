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
    userCalendarID: {
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
  permissions: PermissionKey[];
}

export const CredentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    }
  },
};

//uses CredentialsSchema, for API controller
export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: CredentialsSchema },
  },
};

export interface CredentialResetPassword {
  oldPassword: string;
  newPassword: string;
}

export const CredentialResetPasswordSchema = {
  type: 'object',
  required: ['oldPassword', 'newPassword'],
  properties: {
    oldPassword: {
      type: 'string',
      minLength: 8,
    },
    newPassword: {
      type: 'string',
      minLength: 8,
    },
  },
};

//uses CredentialsSchema, for API controller
export const CredentialResetPasswordRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: CredentialResetPasswordSchema },
  },
};
