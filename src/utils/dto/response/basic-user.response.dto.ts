import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BasicUserResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  code: string;
}
