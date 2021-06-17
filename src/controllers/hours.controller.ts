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
  HttpErrors,
} from '@loopback/rest';
import { Hours } from '../models';
import { HoursRepository, UserRepository, UserCalendarRepository, ProjectRepository, RoleRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKey } from '../authorization/permission-key';
import { inject } from '@loopback/core';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import * as _ from "lodash";

export class HoursController {
  constructor(
    @repository(HoursRepository)
    public hoursRepository: HoursRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCalendarRepository)
    public userCalendarRepository: UserCalendarRepository,
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) { }

  @post('/hours', {
    responses: {
      '200': {
        description: 'Hours model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Hours) } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageHours] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Hours, {
            title: 'NewHours',
            exclude: ['id'],
          }),
        },
      },
    })
    hours: Hours,
  ): Promise<Hours> {
    let hoursDateStart = new Date(hours.date)
    hoursDateStart.setUTCHours(0)
    hoursDateStart.setUTCMinutes(0)
    let hoursDateEnd = new Date(hours.date)
    hoursDateEnd.setUTCHours(23)
    hoursDateEnd.setUTCMinutes(59)

    // Search if the same hours object exists with the given idProject and userId at the same date
    let hoursPrev = await this.hoursRepository.findOne(
      {
        where:
        {
          userId: hours.userId,
          idProject: { like: hours.idProject },
          and: [
            { date: { gte: hoursDateStart } },
            { date: { lte: hoursDateEnd } }
          ],
        }
      })
    if (hoursPrev) {
      await this.hoursRepository.updateById(hoursPrev.id, hours)
      return hours;
    } else {
      return this.hoursRepository.create(hours);
    }
  }

  @get('/hours', {
    responses: {
      '200': {
        description: 'Array of Hours model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Hours) },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageHours] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Hours)) filter?: Filter<Hours>,
  ): Promise<Hours[]> {
    return this.hoursRepository.find(filter);
  }

  @get('/hours/{id}', {
    responses: {
      '200': {
        description: 'Hours model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Hours) } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageHours] })
  async findById(@param.path.string('id') id: string): Promise<Hours> {
    return this.hoursRepository.findById(id);
  }

  @get('/hours/HoursInAWeek/{dateWeek}/{userId}', {
    responses: {
      '200': {
        description: 'Hours model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Hours) } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageHours] })
  async findHoursInAWeek(
    @param.path.string('dateWeek') dateWeek: Date,
    @param.path.string('userId') userId: string,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Hours[]> {
    dateWeek = new Date(dateWeek)
    let weekDays = []
    for (let i = 0; i <= 6; i++) {
      const currentDayNumber = dateWeek.getDay() - 1 // monday = 0, Tuesday = 1 ...
      const dayOfTheMonth = dateWeek.getDate() - (currentDayNumber >= 0 ? currentDayNumber : 6) + i
      const day = new Date(dateWeek.setDate(dayOfTheMonth))
      if (i === 0) {
        day.setUTCHours(0)
        day.setUTCMinutes(0)
      }
      if (i === 6) {
        day.setUTCHours(23)
        day.setUTCMinutes(59)
      }
      weekDays.push(day)
    }
    let weekHours = [];
    let userHoursInAWeek = await this.hoursRepository.find(
      {
        where:
        {
          userId: userId ? userId : currentUserProfile[securityId],
          and: [
            { date: { gte: weekDays[0] } },
            { date: { lte: weekDays[6] } }
          ]
        }
      })
    for (const day of weekDays) {
      const userHour: any = userHoursInAWeek.filter((userHours) => {
        return userHours.date.getUTCDate() === day.getUTCDate()
      });
      weekHours.push(userHour)
    }
    return weekHours;
  }

  @patch('/hours/{id}', {
    responses: {
      '204': {
        description: 'Hours PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageHours] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Hours, { partial: true }),
        },
      },
    })
    hours: Hours,
  ): Promise<void> {
    await this.hoursRepository.updateById(id, hours);
  }

  @del('/hours/{id}', {
    responses: {
      '204': {
        description: 'Hours DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageHours] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.hoursRepository.deleteById(id);
  }
}
