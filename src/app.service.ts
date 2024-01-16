/* eslint-disable @typescript-eslint/no-empty-function */
import { UserCronService } from '@components/user/user.cron.service';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { INSERT_PERMISSION } from '@utils/permissions/permission';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly userService: UserCronService,

    private readonly i18n: I18nService,
  ) {}

  async onModuleInit() {
    await this.updatePermissions();
  }

  async ping(): Promise<any> {
    return new ResponseBuilder('pong item stock planning')
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  getHealth(): any {
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('This is purchased-order-service')
      .build();
  }

  async updatePermissions() {
    let status = false;
    let number = 1;
    do {
      try {
        const responseInsert = await this.userService.insertPermission(
          INSERT_PERMISSION,
        );
        const responseDelete =
          await this.userService.deletePermissionNotActive();
        if (
          responseInsert.statusCode === ResponseCodeEnum.SUCCESS &&
          responseDelete.statusCode === ResponseCodeEnum.SUCCESS
        ) {
          status = true;
        } else {
          number++;
          setTimeout(function () {}, 5000);
        }
      } catch (err) {
        number++;
        setTimeout(function () {}, 5000);
      }
    } while (!status && number < 6);
  }
}
