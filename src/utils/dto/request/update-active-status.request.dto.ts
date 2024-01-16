import { ACTIVE_ENUM } from '@constant/common';
import { BaseDto } from '@core/dto/base.dto';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateActiveStatusPayload extends BaseDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsEnum(ACTIVE_ENUM)
  status: number;
}
