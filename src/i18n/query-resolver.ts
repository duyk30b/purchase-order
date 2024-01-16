import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver, I18nResolverOptions } from 'nestjs-i18n';
@Injectable()
export class QueryResolver implements I18nResolver {
  constructor(@I18nResolverOptions() private keys: string[]) {}

  async resolve(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    let lang: string;

    if (req) {
      for (const key of this.keys) {
        if (req[key] !== undefined) {
          lang = req[key];
          break;
        }
      }
    }

    return lang;
  }
}
