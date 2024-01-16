import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetListByConditionsRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  ids: number[];

  @ApiProperty()
  @IsOptional()
  codes: string[];

  @ApiProperty()
  @IsOptional()
  plantCodes: string[];

  @ApiProperty()
  @IsOptional()
  plantIds: string[];
}
