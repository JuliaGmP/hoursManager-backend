import { Entity, model, property } from '@loopback/repository';

interface scheduleObject {
  day: string;
  hours: number;
}

@model()
export class UserCalendar extends Entity {
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
    type: 'array',
    itemType: 'object',
    required: true,
  })
  schedule: scheduleObject[];

  constructor(data?: Partial<UserCalendar>) {
    super(data);
  }
}

export interface UserCalendarRelations {
  // describe navigational properties here
}

export type UserCalendarWithRelations = UserCalendar & UserCalendarRelations;
