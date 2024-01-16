import { MIMETYPE_FILE_UPLOAD_EXPORT_PLAN } from '@core/components/file/constant/file-upload.constant';
import { ErrorMessageEnum } from '@constant/error-message.enum';
import { IsIn } from 'class-validator';

export class File {
  filename: string;
  data: ArrayBuffer;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

export class FileUpload extends File {
  @IsIn(MIMETYPE_FILE_UPLOAD_EXPORT_PLAN, {
    message: ErrorMessageEnum.MIMETYPE_FILE,
  })
  mimetype: string;
}
