import { DefaultCrudRepository } from '@loopback/repository';
import { Hours, HoursRelations } from '../models';
import { HoursManagerDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class HoursRepository extends DefaultCrudRepository<
  Hours,
  typeof Hours.prototype.id,
  HoursRelations
> {
  constructor(
    @inject('datasources.taskManagerMongoDB') dataSource: HoursManagerDataSource,
  ) {
    super(Hours, dataSource);
  }
}
