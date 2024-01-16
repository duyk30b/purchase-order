import { BaseDto } from '@core/dto/base.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UploadFilesRequest extends BaseDto {
  @IsArray()
  @IsOptional()
  files: any[];
}
