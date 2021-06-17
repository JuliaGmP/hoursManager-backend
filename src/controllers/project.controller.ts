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
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import { Project } from '../models';
import { HoursRepository, ProjectRepository, RoleRepository, UserRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKey } from '../authorization/permission-key';
import * as moment from 'moment'
import * as _ from "lodash";
import { inject } from '@loopback/core';

export class ProjectController {
  constructor(
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @repository(HoursRepository)
    public hoursRepository: HoursRepository,
  ) { }

  @post('/projects', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Project) } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageProjects] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProject',
            exclude: ['id'],
          }),
        },
      },
    })
    project: Omit<Project, 'id'>,
  ): Promise<Project> {
    return this.projectRepository.create(project);
  }

  @get('/projects', {
    responses: {
      '200': {
        description: 'Array of Project model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Project) },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewOwnUser] })
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Project)) filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.projectRepository.find(filter);
  }

  @get('/projects/{id}', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Project) } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageProjects] })
  async findById(@param.path.string('id') id: string): Promise<Project> {
    return this.projectRepository.findById(id);
  }

  @patch('/projects/{id}', {
    responses: {
      '204': {
        description: 'Project PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageProjects] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, { partial: true }),
        },
      },
    })
    project: Project,
  ): Promise<void> {
    await this.projectRepository.updateById(id, project);
  }

  @del('/projects/{id}', {
    responses: {
      '204': {
        description: 'Project DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageProjects] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.projectRepository.deleteById(id);
  }

}
