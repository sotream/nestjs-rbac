import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { IUser, IAuthResponse } from '../interfaces';
import { LOG_LEVEL, Logger } from '../../logger';

@Controller('auth')
export class AuthController {
  private readonly log = new Logger('AuthController', LOG_LEVEL.DEBUG);

  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signUp(@Body() body: IUser): Promise<IAuthResponse> {
    const user = await this.authService.signUp(body);

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: IUser): Promise<IAuthResponse> {
    const user = await this.authService.login(body);

    return user;
  }
}
