import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserWeeklySchedule} from '../models';
import {UserWeeklyScheduleRepository} from '../repositories';

export class UserWeeklyScheduleController {
  constructor(
    @repository(UserWeeklyScheduleRepository)
    public userWeeklyScheduleRepository : UserWeeklyScheduleRepository,
  ) {}

  @post('/user-weekly-schedules')
  @response(200, {
    description: 'UserWeeklySchedule model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserWeeklySchedule)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserWeeklySchedule, {
            title: 'NewUserWeeklySchedule',
            exclude: ['id'],
          }),
        },
      },
    })
    userWeeklySchedule: Omit<UserWeeklySchedule, 'id'>,
  ): Promise<UserWeeklySchedule> {
    return this.userWeeklyScheduleRepository.create(userWeeklySchedule);
  }

  @get('/user-weekly-schedules/count')
  @response(200, {
    description: 'UserWeeklySchedule model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserWeeklySchedule) where?: Where<UserWeeklySchedule>,
  ): Promise<Count> {
    return this.userWeeklyScheduleRepository.count(where);
  }

  @get('/user-weekly-schedules')
  @response(200, {
    description: 'Array of UserWeeklySchedule model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserWeeklySchedule, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserWeeklySchedule) filter?: Filter<UserWeeklySchedule>,
  ): Promise<UserWeeklySchedule[]> {
    return this.userWeeklyScheduleRepository.find(filter);
  }

  @patch('/user-weekly-schedules')
  @response(200, {
    description: 'UserWeeklySchedule PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserWeeklySchedule, {partial: true}),
        },
      },
    })
    userWeeklySchedule: UserWeeklySchedule,
    @param.where(UserWeeklySchedule) where?: Where<UserWeeklySchedule>,
  ): Promise<Count> {
    return this.userWeeklyScheduleRepository.updateAll(userWeeklySchedule, where);
  }

  @get('/user-weekly-schedules/{id}')
  @response(200, {
    description: 'UserWeeklySchedule model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserWeeklySchedule, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserWeeklySchedule, {exclude: 'where'}) filter?: FilterExcludingWhere<UserWeeklySchedule>
  ): Promise<UserWeeklySchedule> {
    return this.userWeeklyScheduleRepository.findById(id, filter);
  }

  @patch('/user-weekly-schedules/{id}')
  @response(204, {
    description: 'UserWeeklySchedule PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserWeeklySchedule, {partial: true}),
        },
      },
    })
    userWeeklySchedule: UserWeeklySchedule,
  ): Promise<void> {
    await this.userWeeklyScheduleRepository.updateById(id, userWeeklySchedule);
  }

  @put('/user-weekly-schedules/{id}')
  @response(204, {
    description: 'UserWeeklySchedule PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userWeeklySchedule: UserWeeklySchedule,
  ): Promise<void> {
    await this.userWeeklyScheduleRepository.replaceById(id, userWeeklySchedule);
  }

  @del('/user-weekly-schedules/{id}')
  @response(204, {
    description: 'UserWeeklySchedule DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userWeeklyScheduleRepository.deleteById(id);
  }
}
