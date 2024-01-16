import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileInforResponeDto {
  @ApiProperty({ description: 'file' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'file' })
  @Expose()
  fileNameRaw: string;

  @ApiProperty({ description: 'fileURl' })
  @Expose()
  fileUrl: string;
}
