import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { NatsClientAuthService } from '../../components/transporter/nats/service/nats-client-auth.service'
import { RequestExternal } from '../decorator/request-external'

const PERMISSION_CODE = 'PERMISSION_CODE'

export const PermissionCode = (roles: string) => {
  return SetMetadata(PERMISSION_CODE, roles)
}

@Injectable({ scope: Scope.REQUEST })
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly natsClientAuthService: NatsClientAuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'rpc') {
      return true
    }

    const permissionCode = this.reflector.getAllAndOverride<string>(
      PERMISSION_CODE,
      [context.getHandler(), context.getClass()]
    )
    if (!permissionCode) return true

    const request: RequestExternal = await context.switchToHttp().getRequest()
    const bearer = request.headers.authorization

    const data = await this.natsClientAuthService.validateToken(
      bearer,
      permissionCode
    )

    request.external = request.external || {}
    request.external.user = data

    return true
  }
}
