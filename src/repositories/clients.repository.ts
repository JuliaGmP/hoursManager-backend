import { DefaultCrudRepository } from '@loopback/repository';
import { Clients, ClientsRelations } from '../models';
import { HoursManagerDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class ClientsRepository extends DefaultCrudRepository<
  Clients,
  typeof Clients.prototype.id,
  ClientsRelations
> {
  constructor(
    @inject('datasources.taskManagerMongoDB') dataSource: HoursManagerDataSource,
  ) {
    super(Clients, dataSource);
  }
}
