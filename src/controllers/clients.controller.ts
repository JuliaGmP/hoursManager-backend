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
import {Clients} from '../models';
import {ClientsRepository} from '../repositories';
import { PermissionKey } from '../authorization/permission-key';
import { authenticate } from '@loopback/authentication';

export class ClientsController {
  constructor(
    @repository(ClientsRepository)
    public clientsRepository : ClientsRepository,
  ) {}

  @post('/clients', {
    responses: {
      '200': {
        description: 'Clients model instance',
        content: {'application/json': {schema: getModelSchemaRef(Clients)}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageClients] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clients, {
            title: 'NewClients',
            exclude: ['id'],
          }),
        },
      },
    })
    clients: Omit<Clients, 'id'>,
  ): Promise<Clients> {
    return this.clientsRepository.create(clients);
  }

  @get('/clients', {
    responses: {
      '200': {
        description: 'Array of Clients model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Clients)},
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewOwnUser] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Clients)) filter?: Filter<Clients>,
  ): Promise<Clients[]> {
    return this.clientsRepository.find(filter);
  }

  @get('/clients/{id}', {
    responses: {
      '200': {
        description: 'Clients model instance',
        content: {'application/json': {schema: getModelSchemaRef(Clients)}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageClients] })
  async findById(@param.path.string('id') id: string): Promise<Clients> {
    return this.clientsRepository.findById(id);
  }

  @patch('/clients/{id}', {
    responses: {
      '204': {
        description: 'Clients PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageClients] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clients, {partial: true}),
        },
      },
    })
    clients: Clients,
  ): Promise<void> {
    await this.clientsRepository.updateById(id, clients);
  }

  @del('/clients/{id}', {
    responses: {
      '204': {
        description: 'Clients DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageClients] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clientsRepository.deleteById(id);
  }
}
