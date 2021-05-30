import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {HoursManagerDataSource} from '../datasources';
import {Hours, HoursRelations} from '../models';

export class HoursRepository extends DefaultCrudRepository<
  Hours,
  typeof Hours.prototype.id,
  HoursRelations
> {
  constructor(
    @inject('datasources.hoursManager') dataSource: HoursManagerDataSource,
  ) {
    super(Hours, dataSource);
  }
}
