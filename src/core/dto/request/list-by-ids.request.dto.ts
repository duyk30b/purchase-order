import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetListByIdsRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  ids: number[];
}
