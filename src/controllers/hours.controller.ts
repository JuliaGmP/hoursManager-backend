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
import {Hours} from '../models';
import {HoursRepository} from '../repositories';

export class HoursController {
  constructor(
    @repository(HoursRepository)
    public hoursRepository : HoursRepository,
  ) {}

  @post('/hours')
  @response(200, {
    description: 'Hours model instance',
    content: {'application/json': {schema: getModelSchemaRef(Hours)}},
  })
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
    hours: Omit<Hours, 'id'>,
  ): Promise<Hours> {
    return this.hoursRepository.create(hours);
  }

  @get('/hours/count')
  @response(200, {
    description: 'Hours model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Hours) where?: Where<Hours>,
  ): Promise<Count> {
    return this.hoursRepository.count(where);
  }

  @get('/hours')
  @response(200, {
    description: 'Array of Hours model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Hours, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Hours) filter?: Filter<Hours>,
  ): Promise<Hours[]> {
    return this.hoursRepository.find(filter);
  }

  @patch('/hours')
  @response(200, {
    description: 'Hours PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Hours, {partial: true}),
        },
      },
    })
    hours: Hours,
    @param.where(Hours) where?: Where<Hours>,
  ): Promise<Count> {
    return this.hoursRepository.updateAll(hours, where);
  }

  @get('/hours/{id}')
  @response(200, {
    description: 'Hours model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Hours, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Hours, {exclude: 'where'}) filter?: FilterExcludingWhere<Hours>
  ): Promise<Hours> {
    return this.hoursRepository.findById(id, filter);
  }

  @patch('/hours/{id}')
  @response(204, {
    description: 'Hours PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Hours, {partial: true}),
        },
      },
    })
    hours: Hours,
  ): Promise<void> {
    await this.hoursRepository.updateById(id, hours);
  }

  @put('/hours/{id}')
  @response(204, {
    description: 'Hours PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() hours: Hours,
  ): Promise<void> {
    await this.hoursRepository.replaceById(id, hours);
  }

  @del('/hours/{id}')
  @response(204, {
    description: 'Hours DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.hoursRepository.deleteById(id);
  }
}
