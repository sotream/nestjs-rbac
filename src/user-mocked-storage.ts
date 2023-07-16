import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as log4js from 'log4js';

import { IUser } from './auth/interfaces';
import { KIND } from './common/constants';
import { IUserResponse } from './users/interfaces';

export class UserStorage {
  private readonly users: Map<string, IUser> = new Map([]);

  async init() {
    const users = [
      {
        email:        'test@test.test',
        password:     '123456',
        [KIND.ROLES]: ['admin'],
        // [KIND.PERMISSIONS]: ['get-all-users'],
      },
    ];

    for (const user of users) {
      await this.create(user);
    }
  }

  getAllUses(): IUserResponse[] {
    const users = [...this.users].map(([id, user]) => ({
      id,
      email: user.email,
    }));

    return users;
  }

  getUserByEmail(email: string): IUser | null {
    const existedUserEntry = [...this.users].find(
      ([, user]) => user.email === email,
    );

    if (!existedUserEntry) {
      return null;
    }

    const [, existedUser] = existedUserEntry;

    return existedUser;
  }

  async create(user: IUser): Promise<IUser> {
    const existedUser = this.getUserByEmail(user.email);

    if (existedUser) {
      throw new BadRequestException('User already exists');
    }

    const id = crypto.randomBytes(12).toString('hex');
    const hashedPassword = await bcrypt.hash(user.password, 11);

    this.users.set(id, {
      ...user,
      password: hashedPassword,
    });

    return { id, ...user };
  }

  remove(id: string): boolean {
    const user = this.users.get(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.users.delete(id);

    return true;
  }
}

const log = log4js.getLogger(UserStorage.name);

log.level = 'debug';

export const userStorage = new UserStorage();

userStorage
  .init()
  .then(() => {
    log.debug('Mocked user storage has been initialized');
  })
  .catch((error) => {
    log.error('Failed to initialize mocked user storage', error);
  });
