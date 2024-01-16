import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class BaseResponseDto {
  @ApiProperty()
  @Expose({ name: '_id' })
  @Transform((value) => {
    return value.obj._id?.toString() || value.obj.id;
  })
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose({ name: 'createdAt' })
  createdAt: Date;

  @ApiProperty()
  @Expose({ name: 'updatedAt' })
  updatedAt: Date;
}
