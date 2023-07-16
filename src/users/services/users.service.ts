import { Injectable } from '@nestjs/common';

import { IUserResponse } from '../interfaces';
import { UserStorage, userStorage } from '../../user-mocked-storage';
import { Logger, LOG_LEVEL } from '../../logger';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService', LOG_LEVEL.DEBUG);
  private readonly userStorage: UserStorage;

  constructor() {
    this.userStorage = userStorage;
  }

  getUsers(): IUserResponse[] {
    this.logger.debug('Call getUsers service method');

    const users = this.userStorage.getAllUses();

    return users;
  }
}
