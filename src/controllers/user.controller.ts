import { inject } from '@loopback/context';
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
  HttpErrors,
} from '@loopback/rest';
import { JWTService } from '../authorization/JWT.service';
import { Getter } from '@loopback/core';
import { MyAuthBindings } from '../authorization/keys';
import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { User } from '../models';
import { RoleRepository, UserRepository, UserWeeklyScheduleRepository } from '../repositories';
import { MyUserProfile, Credential, UserProfileSchema } from '../types/types';
import { PermissionKey } from '../authorization/permission-key';
import { PasswordService } from '../repositories/password.service';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @repository(UserWeeklyScheduleRepository)
    public userWeeklyScheduleRepository: UserWeeklyScheduleRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>
  ) { }


  @post('/users/register', {
    security: [],
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': User } } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.CreateUser] })
  async create(@requestBody({
    description: 'The input of create user function',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            password: {
              type: 'string',
              minLength: 8,
            },
            userWeeklyScheduleID: {
              type: "string"
            }
          },
        }
      },
    },
  }) user: User): Promise<Omit<User, 'password'>> {
    //Check user exist

    if (
      await this.userRepository.findOne({
        where: {
          email: user.email
        },
      })
    ) {
      throw new HttpErrors.Conflict(`There is a user with this email`);
    }

    let userCalendar = await this.userWeeklyScheduleRepository.findOne({
      where: {
        id: user.userWeeklyScheduleID,
      },
    })

    if (!userCalendar) {
      throw new HttpErrors.NotFound(`There is no sserWeeklySchedule with this userWeeklyScheduleID`)
    }
    let userRole;
    if (user.rolesId) {
      userRole = await this.roleRepository.findOne({
        where: {
          id: user.rolesId[0],
        },
      })

      if (!userRole) {
        userRole = await this.roleRepository.findOne({
          where: {
            name: "NormalUser",
          },
        })

        if (!userRole) {
          userRole = await this.roleRepository.create({
            name: "NormalUser",
            permissions: this.roleRepository.getNormalUser()
          })
        }
      }
    } else {
      userRole = await this.roleRepository.create({
        name: "NormalUser",
        permissions: this.roleRepository.getNormalUser()
      })
    }

    let savedUser = new User({
      email: user.email,
      rolesId: [userRole.id!],
      name: user.name,
      userWeeklyScheduleID: user.userWeeklyScheduleID,
      permissions: userRole.permissions
    });

    //Encryption pass
    const bcrypt = await require('bcryptjs');
    const salt = await bcrypt.genSaltSync(10);
    savedUser.password = await bcrypt.hashSync(user.password, salt);

    // create the new user
    savedUser = await this.userRepository.create(savedUser);

    return savedUser;
  }

  @post('/users/login', {
    security: [],
    responses: {
      '200': {
        description: 'Token',
        content: {},
      },
    },
  })
  async login(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
              password: {
                type: 'string',
                minLength: 8,
              }
            },
          }
        },
      },
    }) credential: Credential,
  ): Promise<{ token: string }> {
    const token = await this.jwtService.getTokenWithPasswordCredential(
      credential,
    );
    return { token };
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, { exclude: 'where' }) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
