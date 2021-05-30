import {Entity, model, property} from '@loopback/repository';

@model()
export class UserWeeklySchedule extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'object',
    required: true,
  })
  schedule: object;


  constructor(data?: Partial<UserWeeklySchedule>) {
    super(data);
  }
}

export interface UserWeeklyScheduleRelations {
  // describe navigational properties here
}

export type UserWeeklyScheduleWithRelations = UserWeeklySchedule & UserWeeklyScheduleRelations;
