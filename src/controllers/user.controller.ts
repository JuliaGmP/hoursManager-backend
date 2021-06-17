import { repository, Filter } from '@loopback/repository';
import { post, param, get, del, requestBody, HttpErrors, getModelSchemaRef, getFilterSchemaFor, patch } from '@loopback/rest';
import { User } from '../models/';
import { UserRepository, RoleRepository, UserCalendarRepository } from '../repositories';
import { inject, Getter } from '@loopback/core';
import { MyAuthBindings } from '../authorization/keys';
import { JWTService } from '../services';
import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import {
  MyUserProfile,
  UserRequestBody,
  CredentialsRequestBody,
  Credential,
  UserProfileSchema,
  CredentialResetPasswordRequestBody,
  CredentialResetPassword,
} from '../types/types';
import { PermissionKey } from '../authorization/permission-key';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @repository(UserCalendarRepository)
    public userCalendarRepository: UserCalendarRepository,
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
  async create(@requestBody(UserRequestBody) user: User): Promise<User> {
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

    let userCalendar = await this.userCalendarRepository.findOne({
      where: {
        id: user.userCalendarID,
      },
    })

    if (!userCalendar) {
      throw new HttpErrors.NotFound(`There is no userCalendar with this userCalendarID`)
    }

    let userRole = await this.roleRepository.findOne({
      where: {
        id: user.rolesID[0],
      },
    })

    if (!userRole) {
      userRole = await this.roleRepository.findOne({
        where: {
          role: "NormalUser",
        },
      })

      if (!userRole) {
        userRole = await this.roleRepository.create({
          role: "NormalUser",
          permissions: this.roleRepository.getNormalUser()
        })
      }
    }

    let savedUser = new User({
      email: user.email,
      rolesID: [userRole.id!],
      name: user.name,
      userCalendarID: user.userCalendarID,
      permissions: userRole.permissions
    });

    //Encryption pass
    const bcrypt = await require('bcryptjs');
    const salt = await bcrypt.genSaltSync(10);
    savedUser.password = await bcrypt.hashSync(savedUser.password, salt);

    // create the new user
    savedUser = await this.userRepository.create(savedUser);

    delete savedUser.password;
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
    @requestBody(CredentialsRequestBody) credential: Credential,
  ): Promise<{ token: string }> {
    const token = await this.jwtService.getTokenWithPasswordCredential(
      credential,
    );
    return { token };
  }

  @get('/users/me', {
    //security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewOwnUser] })
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];
    return currentUserProfile;
  }

  @get('/users/me/userProfile', {
    responses: {
      '200': {
        description: 'user model instance',
        content: { 'application/json': { schema: getModelSchemaRef(User) } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewOwnUser] })
  async finduserProfile(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile
  ): Promise<User> {
    return this.userRepository.findById(currentUserProfile[securityId]);
  }

  @post('/users/addRoleToUser/{idRole}/{idUser}', {
    responses: {
      '204': {
        description: 'User ADD role and UPDATE permissions',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ManageRoles] })
  async addRoleToUser(
    @param.path.string('idRole') idRole: string,
    @param.path.string('idUser') idUser: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: idUser } })
    const role = await this.roleRepository.findOne({ where: { id: idRole } })
    if (!user) {
      throw new HttpErrors.NotFound(`There is no user with this ID`)
    }
    if (!role) {
      throw new HttpErrors.NotFound(`There is no role with this ID`)
    }

    if (user.rolesID.includes(role.id!)) {
      return;
    }
    else {
      user.rolesID.push(role.id!)
      const totalPermissions = user.permissions.concat(role.permissions)
      const uniqueSet = new Set(totalPermissions)
      user.permissions = [...uniqueSet]
      await this.userRepository.updateById(idUser, user)
    }
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: { 'application/json': { schema: getModelSchemaRef(User) } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewAnyUser] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'Activities PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.UpdateAnyUser] })
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
    if (user.rolesID) {
      const userRole = await this.roleRepository.findById(user.rolesID[0])
      if (userRole) {
        user.permissions = userRole.permissions
      }
    }
    await this.userRepository.updateById(id, user);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of Clients model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(User) },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.ViewAnyUser] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }


  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKey.DeleteAnyUser] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
