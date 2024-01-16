import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MetaData {
  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  total: number;
}

export class PaginationResponse {
  @ApiProperty()
  @Expose()
  items: any;

  @ApiProperty({
    type: MetaData,
    example: {
      page: 0,
      total: 0,
    },
  })
  @Expose()
  meta?: MetaData;
}
