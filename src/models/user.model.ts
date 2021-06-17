import { Entity, model, property } from '@loopback/repository';
import { PermissionKey } from '../authorization/permission-key';
import { v4 as uuid } from 'uuid';

@model({ settings: { strict: false } })
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: false
  })
  email: string;

  @property({
    type: 'string',
    required: false
  })
  password: string;

  @property({
    type: 'string',
    required: true
  })
  userCalendarID: string;

  @property.array(String)
  rolesID: string[];

  @property.array(String)
  permissions: PermissionKey[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
