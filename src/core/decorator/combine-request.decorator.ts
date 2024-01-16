import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function formatRequest(data): any {
  if (!data) {
    return {};
  }
  delete data.userId;
  delete data.user;
  return data;
}

export const RequestHttp = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const params = formatRequest(request.params);
    const query = formatRequest(request.query);
    const body = formatRequest(request.body);
    const context = {
      ...params,
      ...query,
      ...body,
      userId: request.user.id,
      user: request.user,
    };
    return context;
  },
);
