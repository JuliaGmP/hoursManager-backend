import { DefaultCrudRepository } from '@loopback/repository';
import { UserCalendar, UserCalendarRelations } from '../models';
import { HoursManagerDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class UserCalendarRepository extends DefaultCrudRepository<
  UserCalendar,
  typeof UserCalendar.prototype.id,
  UserCalendarRelations
> {
  constructor(
    @inject('datasources.hoursManager') dataSource: HoursManagerDataSource,
  ) {
    super(UserCalendar, dataSource);
  }
}
