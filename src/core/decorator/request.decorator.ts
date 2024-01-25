import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { NatsContext } from '@nestjs/microservices'

export const HeaderReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const [req, res] = ctx.getArgs()

    if (ctx.getType() === 'rpc') {
      if (res.constructor.name === 'NatsContext') {
        // const response = ctx.switchToRpc().getContext<NatsContext>()
        const response: NatsContext = res
        const headersMap = response.getHeaders().headers
        const headers = Object.fromEntries(headersMap.entries())
        return headers
      }
    }

    return {}
  }
)
