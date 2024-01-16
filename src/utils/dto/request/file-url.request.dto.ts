import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class FileUrlParamDto extends BaseDto {
  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fileUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fileNameRaw: string;
}
