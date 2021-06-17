import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {UserCalendar} from '../models';
import {UserCalendarRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKey } from '../authorization/permission-key';

export class UserCalendarController {
  constructor(
    @repository(UserCalendarRepository)
    public userCalendarRepository : UserCalendarRepository,
  ) {}

  @post('/user-calendars', {
    responses: {
      '200': {
        description: 'UserCalendar model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCalendar)}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.UpdateAnyUser] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCalendar, {
            title: 'NewUserCalendar',
            exclude: ['id'],
          }),
        },
      },
    })
    userCalendar: Omit<UserCalendar, 'id'>,
  ): Promise<UserCalendar> {
    return this.userCalendarRepository.create(userCalendar);
  }

  @get('/user-calendars', {
    responses: {
      '200': {
        description: 'Array of UserCalendar model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserCalendar)},
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewAnyUser] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(UserCalendar)) filter?: Filter<UserCalendar>,
  ): Promise<UserCalendar[]> {
    return this.userCalendarRepository.find(filter);
  }

  @get('/user-calendars/{id}', {
    responses: {
      '200': {
        description: 'UserCalendar model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCalendar)}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewOwnUser] })
  async findUserCalendarById(@param.path.string('id') id: string): Promise<UserCalendar> {
    return this.userCalendarRepository.findById(id);
  }

  @patch('/user-calendars/{id}', {
    responses: {
      '204': {
        description: 'UserCalendar PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.UpdateOwnUser] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCalendar, {partial: true}),
        },
      },
    })
    userCalendar: UserCalendar,
  ): Promise<void> {
    await this.userCalendarRepository.updateById(id, userCalendar);
  }

  @del('/user-calendars/{id}', {
    responses: {
      '204': {
        description: 'UserCalendar DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.UpdateOwnUser] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userCalendarRepository.deleteById(id);
  }
}
