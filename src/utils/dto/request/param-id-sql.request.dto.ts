import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class IdParamSqlDto extends BaseDto {
  @ApiProperty()
  @IsInt()
  @Transform(({ value }) => +value)
  @IsNotEmpty()
  id: number;
}
