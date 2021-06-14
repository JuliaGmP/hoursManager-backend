import { Entity, model, property } from '@loopback/repository';

@model()
export class Hours extends Entity {
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
  userId: string;

  @property({
    type: 'date',
    required: true,
  })
  date: Date;

  @property({
    type: 'number',
    required: true,
  })
  numberHours: number;

  @property({
    type: 'string',
    required: true,
  })
  idProject: string;


  constructor(data?: Partial<Hours>) {
    super(data);
  }
}

export interface HoursRelations {
  // describe navigational properties here
}

export type HoursWithRelations = Hours & HoursRelations;
