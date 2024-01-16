import { ConfigService } from '@config/config.service';
import { APIPrefix } from '@constant/common';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { HttpClientService } from '@core/components/http-client/http-client.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import * as FormData from 'form-data';
import {
  FileResource,
  MAX_SIZE_FILE_UPLOAD,
  UPLOAD_FILE_ENPOINT,
} from './constant/file-upload.constant';
import { FileServiceInterface } from './interface/file.service.interface';
import { isEmpty } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { validateFileSizes } from '@utils/common';

@Injectable()
export class FileService implements FileServiceInterface {
  private readonly logger = new Logger(FileService.name);
  protected readonly urlConfig: any;
  protected readonly url: string;

  constructor(
    @Inject('ConfigServiceInterface')
    private readonly configService: ConfigService,
    private readonly httpClientService: HttpClientService,

    private readonly i18n: I18nRequestScopeService,
  ) {
    this.configService = new ConfigService();
    this.urlConfig = this.configService.get('fileService');
    this.url = `http://${
      this.urlConfig?.options?.host + ':' + this.urlConfig?.options?.port
    }`;
  }
  saveFiles(resource: any, resourceId: any, files: any[]): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getFileById(fileId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async uploadFiles(files: any[], resource: string): Promise<any> {
    const form = new FormData();
    form.append('service', 'request-service');
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
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      },
    );
  }

  async uploadFile(file: any, resource: string): Promise<any> {
    const form = new FormData();
    form.append('service', 'request-service');
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
    if (isEmpty(fileIds)) {
      return [];
    }
    const respone = await this.httpClientService.get(
      `${this.generateUrlFileService(
        UPLOAD_FILE_ENPOINT.INFO,
      )}?ids=${fileIds} `,
    );
    if (respone.statusCode != ResponseCodeEnum.SUCCESS) {
      return [];
    }
    return respone.data;
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

  async handleSaveFiles({
    resource,
    currentFiles,
    oldFiles,
    files,
  }): Promise<any> {
    //handle old files
    try {
      const result = [] as any[];
      const oldFileIds = [];
      if (!isEmpty(oldFiles)) {
        oldFiles.forEach((file) => {
          if (file && !isEmpty(file)) oldFileIds.push(file.id);
        });
      }
      const deleteFiles = currentFiles.filter(
        (file) => !oldFileIds.includes(file.fileId),
      );

      if (!isEmpty(deleteFiles)) {
        await this.deleteFileByIds(
          deleteFiles.map((deleteFile) => deleteFile.fileId),
        );
      }

      //handle new files
      if (!isEmpty(files)) {
        const sizeAccept = validateFileSizes(
          files,
          MAX_SIZE_FILE_UPLOAD.EXPORT_PLAN,
        );

        if (!sizeAccept) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .withMessage(
              await this.i18n.translate('error.FILE_UPLOAD_MAX_SIZE'),
            )
            .build();
        }
        const fileResponse = await this.uploadFiles(files, resource);

        if (fileResponse.statusCode !== ResponseCodeEnum.SUCCESS) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
            .withMessage(fileResponse?.message)
            .build();
        }
        fileResponse.data.forEach((fileId) => result.push(fileId));
      }

      return new ResponseBuilder([...result, ...oldFileIds])
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (error) {
      this.logger.error('Handle Upload File Error', error);
      return new ResponseBuilder()
        .withData(error)
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }
}
