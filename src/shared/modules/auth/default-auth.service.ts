import { inject, injectable } from 'inversify';
import { SignJWT } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { UserService } from '../user/user-service.interface.js';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { UserEntity } from '../user/user.entity.js';
import { HttpError } from '../../libs/rest/index.js';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.constant.js';
import { TokenPayload } from './types/token-payload.type.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
    };

    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(new TextEncoder().encode(this.config.get('JWT_SECRET')));
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Invalid login attempt for ${dto.email}`);
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid email or password',
        'AuthService',
      );
    }

    return user;
  }
}
