import {TokenService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories/user.repository';
import {MyUserProfile, Credential} from '../types/types';
import {HttpErrors} from '@loopback/rest';
import {TokenServiceConstants} from '../authorization/keys';
import {promisify} from 'util';
import {securityId} from '@loopback/security';
import {User} from '../models';

/**
 * This is a service that generates and verifies JWT tokens, and will be used by JWTStrategy.
 */
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async verifyToken(token: string): Promise<MyUserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null.`,
      );
    }
    let userProfile: MyUserProfile;
    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(
        token,
        TokenServiceConstants.TOKEN_SECRET_VALUE,
      );
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        {[securityId]: '', email: '', permissions: ''},
        {
          [securityId]: decodedToken.id,
          email: decodedToken.email,
          permissions: decodedToken.permissions,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(userProfile: MyUserProfile): Promise<string> {
    const userInfoForToken = {
      id: userProfile[securityId],
      email: userProfile.email,
      permissions: userProfile.permissions,
    };
    const token = await signAsync(
      userInfoForToken,
      TokenServiceConstants.TOKEN_SECRET_VALUE,
      {expiresIn: TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE},
    );
    return token;
  }

  async getTokenWithPasswordCredential(
    credential: Credential,
  ): Promise<string> {
    const foundUser = await this.userRepository.findOne({
      where: {email: credential.email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(
        `User with this email not found.`,
      );
    }
    //Desencrypt the password.
    const bcrypt = require('bcryptjs');

    if (!bcrypt.compareSync(credential.password, foundUser.password)) {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

    const currentUser: MyUserProfile = this.convertToUserProfile(foundUser);
    const token = await this.generateToken(currentUser);
    return token;
  }

  async getTokenWithSocialCredential(email: string): Promise<string> {
    const foundUser = await this.userRepository.findOne({
      where: {email: email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(`User with email ${email} not found.`);
    }

    const currentUser: MyUserProfile = this.convertToUserProfile(foundUser);
    const token = await this.generateToken(currentUser);
    return token;
  }

  convertToUserProfile(user: User): MyUserProfile {
    return {
      [securityId]: user.id!,
      email: user.email,
      permissions: user.permissions,
    };
  }
}
