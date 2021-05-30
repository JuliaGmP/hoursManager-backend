import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {HoursManagerDataSource} from '../datasources';
import {UserWeeklySchedule, UserWeeklyScheduleRelations} from '../models';

export class UserWeeklyScheduleRepository extends DefaultCrudRepository<
  UserWeeklySchedule,
  typeof UserWeeklySchedule.prototype.id,
  UserWeeklyScheduleRelations
> {
  constructor(
    @inject('datasources.hoursManager') dataSource: HoursManagerDataSource,
  ) {
    super(UserWeeklySchedule, dataSource);
  }
}
