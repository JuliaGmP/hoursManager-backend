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
import {Role} from '../models';
import {RoleRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKey } from '../authorization/permission-key';

export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) {}

  @post('/roles', {
    responses: {
      '200': {
        description: 'Role model instance',
        content: {'application/json': {schema: {'x-ts-type': Role}}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageRoles] })
  async create(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Role, {
          title: 'NewRole',
          exclude: ['id'],
        }),
      },
    },
  }) role: Role): Promise<Role> {
    return this.roleRepository.create(role);
  }

  @get('/roles', {
    responses: {
      '200': {
        description: 'Array of Role model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Role}},
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewRoles] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Role))
    filter?: Filter<Role>,
  ): Promise<Role[]> {
    return this.roleRepository.find({where : {role : {nlike : "SuperAdmin"}}});
  }

  @get('/roles/{id}', {
    responses: {
      '200': {
        description: 'Role model instance',
        content: {'application/json': {schema: {'x-ts-type': Role}}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewRoles] })
  async findById(@param.path.string('id') id: string): Promise<Role> {
    return this.roleRepository.findById(id);
  }

  @patch('/roles/{id}', {
    responses: {
      '204': {
        description: 'Role PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageRoles] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Role,
  ): Promise<void> {
    await this.roleRepository.updateById(id, role);
  }

  @del('/roles/{id}', {
    responses: {
      '204': {
        description: 'Role DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageRoles] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.roleRepository.deleteById(id);
  }
}
