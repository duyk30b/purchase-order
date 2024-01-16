import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FactoryBasicResponse {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  name: string;
}
