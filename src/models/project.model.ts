import { Entity, model, property } from '@loopback/repository';

@model()
export class Project extends Entity {
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
    type: 'string',
    required: true,
  })
  idClient: string;

  @property({
    type: 'number',
    required: true,
  })
  estimatedHours: number;

  @property({
    type: 'date',
    required: true,
  })
  initialDate: Date;

  @property({
    type: 'date',
    required: true,
  })
  endDate: Date;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  userIDs: string[];


  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
