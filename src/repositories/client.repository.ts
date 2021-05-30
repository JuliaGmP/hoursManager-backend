import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {HoursManagerDataSource} from '../datasources';
import {Client, ClientRelations} from '../models';

export class ClientRepository extends DefaultCrudRepository<
  Client,
  typeof Client.prototype.id,
  ClientRelations
> {
  constructor(
    @inject('datasources.hoursManager') dataSource: HoursManagerDataSource,
  ) {
    super(Client, dataSource);
  }
}
