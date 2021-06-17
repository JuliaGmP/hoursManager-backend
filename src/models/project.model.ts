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
    default: () => new Date(),
  })
  initialDate: Date;

  @property({
    type: 'date'
  })
  endDate: Date;

  @property.array(String)
  userIDs: string[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
