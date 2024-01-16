import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

interface IncomingMessage {
  topic: string;
  partition: number;
  timestamp: string;
  magicByte: number;
  attributes: number;
  offset: string;
  key: any;
  value: any;
  headers: Record<string, any>;
}

class Reading {
  @ApiProperty()
  deviceName: string;  
  
  @IsOptional()
  deviceId: number;  

  @IsOptional()
  producingStepId: number;

  @ApiProperty()
  resourceName: string;

  @ApiProperty()
  profileName: string;

  @ApiProperty()
  value: any;
}

export class IotValue {
  @ApiProperty()
  readings: Reading[];
}

export class IoTRequestDto extends BaseDto implements IncomingMessage {
  @IsString()
  readonly topic: string;

  @IsNumber()
  readonly partition: number;

  @IsString()
  readonly timestamp: string;

  @IsNumber()
  readonly magicByte: number;

  @IsNumber()
  readonly attributes: number;

  @IsString()
  readonly offset: string;

  @IsString()
  @IsOptional()
  readonly key: string;

  @IsObject()
  readonly value: IotValue;

  @IsObject()
  @IsOptional()
  readonly headers: Record<string, any>;
}
