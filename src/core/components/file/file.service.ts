import { ConfigService } from '@config/config.service';
import { APIPrefix } from '@constant/common';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { HttpClientService } from '@core/components/http-client/http-client.service';
import { Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import * as FormData from 'form-data';
import {
  MAX_SIZE_FILE_UPLOAD,
  UPLOAD_FILE_ENPOINT,
} from './constant/file-upload.constant';
import { FileServiceInterface } from './interface/file.service.interface';
import { I18nService } from 'nestjs-i18n';
import { minus } from '@utils/common';
import { FileUpload } from '@core/dto/request/file.request.dto';

@Injectable()
export class FileService implements FileServiceInterface {
  protected readonly urlConfig: any;
  protected readonly url: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpClientService: HttpClientService,
    private readonly i18n: I18nService,
  ) {
    this.configService = new ConfigService();
    this.urlConfig = this.configService.get('fileService');
    this.url = `http://${
      this.urlConfig?.options?.host + ':' + this.urlConfig?.options?.port
    }`;
  }

  async uploadFiles(files: any[], resource: string): Promise<any> {
    const form = new FormData();
    form.append('service', 'produce-service');
    form.append('resource', resource);
    files.forEach((file) => {
      form.append('files', Buffer.from(file.data), {
        filename: file.filename,
      });
    });

    return await this.httpClientService.post(
      this.generateUrlFileService(UPLOAD_FILE_ENPOINT.MULTIPLE),
      form,
      {
        ...form.getHeaders(),
      },
    );
  }

  async uploadFile(file: any, resource: string): Promise<any> {
    const form = new FormData();
    form.append('service', 'produce-service');
    form.append('resource', resource);
    form.append('files', Buffer.from(file.data), {
      filename: file.filename,
    });

    return await this.httpClientService.post(
      this.generateUrlFileService(UPLOAD_FILE_ENPOINT.SINGLE),
      form,
      {
        ...form.getHeaders(),
      },
    );
  }

  async getFilesByIds(ids: string[]): Promise<any> {
    const fileIds = ids.toString();
    const response = await this.httpClientService.get(
      `${this.generateUrlFileService(UPLOAD_FILE_ENPOINT.INFO)}?ids=${fileIds}`,
    );
    if (response.statusCode != ResponseCodeEnum.SUCCESS) {
      return [];
    }
    return response.data;
  }

  async deleteFileByIds(ids: string[]): Promise<any> {
    if (!ids) return;
    const fileIds = ids.toString();
    const respone = await this.httpClientService.delete(
      `${this.generateUrlFileService(
        UPLOAD_FILE_ENPOINT.MULTIPLE,
      )}?ids=${fileIds}`,
    );
    if (respone.statusCode != ResponseCodeEnum.SUCCESS) {
      return [];
    }
    return respone.data;
  }

  private generateUrlFileService(type: string): string {
    return `${this.url}/${APIPrefix.Version}/${type}`;
  }

  async handleSaveFiles(
    resourceId: any,
    resource: any,
    oldFiles: any,
    files: any,
  ): Promise<any> {
    try {
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    } finally {
    }
  }

  private getFileSize(file: FileUpload) {
    return file?.data.byteLength || 0;
  }
  private validateFileSizes(files: FileUpload[]) {
    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      if (minus(this.getFileSize(file), MAX_SIZE_FILE_UPLOAD.SIZE) > 0) {
        return false;
      }
    }
    return true;
  }
}
