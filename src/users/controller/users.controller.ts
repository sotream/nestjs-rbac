import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { RBACPermissions } from '../../common/decorators/rbac-permissions.decorator';
import { KIND } from '../../common/constants';
import { RBACAuthGuard } from '../../auth/rbac-auth.guard';
import { IUserResponse } from '../interfaces';
import { UsersService } from '../services/users.service';
import { Logger, LOG_LEVEL } from '../../logger';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger('UsersController', LOG_LEVEL.DEBUG);

  constructor(private userService: UsersService) {}

  @RBACPermissions({
    [KIND.PERMISSIONS]: ['get-all-users'],
    [KIND.ROLES]:       ['admin'],
  })
  @UseGuards(RBACAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getUsers(): Promise<IUserResponse[]> {
    const user = this.userService.getUsers();

    return user;
  }
}
