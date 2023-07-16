import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { IUser, IAuthResponse } from '../interfaces';
import { UserStorage, userStorage } from '../../user-mocked-storage';
import { Logger, LOG_LEVEL } from '../../logger';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService', LOG_LEVEL.DEBUG);
  private readonly userStorage: UserStorage;

  constructor(private jwtService: JwtService) {
    this.userStorage = userStorage;
  }

  async login(data: IUser): Promise<IAuthResponse> {
    this.logger.debug('login data', data);

    const { email, password } = data;
    const dbUser = this.userStorage.getUserByEmail(email);

    if (!dbUser) {
      throw new UnauthorizedException('credentials not valid');
    }

    const isPasswordValid = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('credentials not valid');
    }

    const payload: Pick<IUser, 'roles' | 'permissions'> = {
      roles:       dbUser.roles,
      permissions: dbUser.permissions,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      id:    dbUser.id,
      email: dbUser.email,
      access_token,
    };
  }

  async signUp(data: IUser): Promise<IAuthResponse> {
    this.logger.debug('signUp data', data);

    const user = await this.userStorage.create(data);

    const payload = {};

    const access_token = await this.jwtService.signAsync(payload);

    return {
      id:    user.id,
      email: user.email,
      access_token,
    };
  }
}
