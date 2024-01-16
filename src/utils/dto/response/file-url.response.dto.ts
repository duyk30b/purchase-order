import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileUrlResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  fileUrl: string;

  @ApiProperty()
  @Expose()
  fileNameRaw: string;
}
