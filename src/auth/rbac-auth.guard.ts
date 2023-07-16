import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { KIND } from '../common/constants';
import { PermissionType } from '../common/decorators/rbac-permissions.decorator';
import { Logger, LOG_LEVEL } from '../logger';

@Injectable()
export class RBACAuthGuard implements CanActivate {
  private readonly logger = new Logger('RBACAuthGuard', LOG_LEVEL.DEBUG);

  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isAllowed = false;
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const permissionsData =
        this.reflector.get<PermissionType>(
          'RBACPermissions',
          context.getHandler(),
        ) ||
        this.reflector.get<PermissionType>(
          'RBACPermissions',
          context.getClass(),
        );

      const permissions = permissionsData[KIND.PERMISSIONS];
      const roles = permissionsData[KIND.ROLES];

      if (!Array.isArray(permissions) && !Array.isArray(roles)) {
        this.logger.error('wrong permissions setup on the server side');

        throw new ForbiddenException(
          'User not allowed to perform this operation',
        );
      }

      const rolesAccess = payload[KIND.ROLES] || [];

      isAllowed = rolesAccess.some((item: string) => roles.includes(item));

      if (!isAllowed) {
        const permissionsAccess = payload[KIND.PERMISSIONS] || [];

        isAllowed = permissionsAccess.some((item: string) =>
          permissions.includes(item),
        );
      }

      if (!isAllowed) {
        throw new ForbiddenException(
          'User not allowed to perform this operation',
        );
      }

      if (!isAllowed) {
        return isAllowed;
      }

      request['user'] = payload;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new UnauthorizedException();
    }

    return isAllowed;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
