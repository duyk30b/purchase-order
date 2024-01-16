import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IdParamMongoDto extends BaseDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
