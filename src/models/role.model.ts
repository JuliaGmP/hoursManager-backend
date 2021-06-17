import {Entity, model, property} from '@loopback/repository';
import { PermissionKey } from '../authorization/permission-key';

@model({settings: {}})
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  role: string;

  @property.array(String)
  permissions: PermissionKey[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
