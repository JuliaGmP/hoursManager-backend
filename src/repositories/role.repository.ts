import { DefaultCrudRepository } from '@loopback/repository';
import { Role, RoleRelations } from '../models';
import { HoursManagerDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { PermissionKey } from '../authorization/permission-key';
import { HttpErrors } from '@loopback/rest';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  constructor(
    @inject('datasources.hoursManager')
    dataSource: HoursManagerDataSource,
  ) {
    super(Role, dataSource);
  }

  getNormalUser(): Array<PermissionKey> {
    return [
      PermissionKey.ViewOwnUser,
      PermissionKey.CreateUser,
      PermissionKey.UpdateOwnUser,
      PermissionKey.DeleteOwnUser,
    ];
  }

  getPermissionRole(role: string): Array<PermissionKey> {
    if (!this.checkRole(role)) {
      throw new HttpErrors.NotFound(`This role not exists`);
    }

    //In this example there is only one type of role this is the reason because there is no a Case or an if
    return [
      PermissionKey.ViewOwnUser,
      PermissionKey.CreateUser,
      PermissionKey.UpdateOwnUser,
      PermissionKey.DeleteOwnUser,
    ];

  }

  private checkRole(role: string): boolean {
    return role === 'User';
  }
}
