import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_CODE } from '@core/decorator/get-code.decorator';
import { AuthServiceInterface } from '@components/auth/interface/auth.service.interface';
import { IS_PUBLIC_KEY } from '@core/decorator/set-public.decorator';
import { ConfigService } from '@config/config.service';
import { isEmpty } from 'lodash';
import { AuthorizedRequest } from '@core/dto/authorized.request.dto';
import { ROLE } from '@utils/constant';
@Injectable({ scope: Scope.REQUEST })
export class AuthorizationGuard implements CanActivate {
  private readonly configService: ConfigService;

  constructor(
    private reflector: Reflector,
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {
    this.configService = new ConfigService();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const req = await context.switchToHttp().getRequest();
    req.lang = req.headers?.lang;
    const token =
      context.getType() === 'rpc'
        ? `Bearer ${this.configService.get('internalToken')}`
        : req.headers['authorization'];

    if (
      req.headers?.['authorization'] ===
      `Bearer ${this.configService.get('internalToken')}`
    ) {
      if (req.body) {
        req.body.user = { role: ROLE.ADMIN };
      }
      if (req.params) {
        req.params.user = { role: ROLE.ADMIN };
      }
      if (req.query) {
        req.query.user = { role: ROLE.ADMIN };
      }
      req.authorized = new AuthorizedRequest();
      req.authorized.isAdmin = true;
      return true;
    }
    const permissionCode = this.reflector.getAllAndOverride<string>(
      PERMISSION_CODE,
      [context.getHandler(), context.getClass()],
    );
    const res = await this.authService.validateToken(token, permissionCode);

    const user = res.data;
    if (res) {
      if (res.statusCode !== 200) {
        throw new HttpException(res.message, res.statusCode);
      }
      if (user && !isEmpty(user)) req.user = user;

      if (res.statusCode !== 200) {
        throw new HttpException(res.message, res.statusCode);
      }
      if (req.body && user && !isEmpty(user)) {
        req.body.user = user;
        req.body.userId = user?.id;
      }
      if (req.params && user && !isEmpty(user)) {
        req.params.user = user;
        req.params.userId = user?.id;
      }
      if (req.query && user && !isEmpty(user)) {
        req.query.user = user;
        req.query.userId = user?.id;
      }
      req.authorized = user?.authorized;
      return true;
    }

    return false;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
