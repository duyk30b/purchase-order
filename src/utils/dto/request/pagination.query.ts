import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { isJson } from 'src/helper/string.helper';
import { EnumSort } from '../../common';

export class Sort {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(EnumSort)
  order: any;
}

export class Filter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}

export class PaginationQuery extends BaseDto {
  KEYS = [];

  constructor() {
    super();

    if (!this.page) this.page = 1;
  }

  @Allow()
  @Transform((value) => {
    return Number(value.value) || 1;
  })
  page?: number;

  @Allow()
  limit?: number;

  @ApiPropertyOptional({ example: 'factory', description: '' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    example: [{ columm: 'name', text: 'abc' }],
    description: '',
  })
  @IsOptional()
  @Type(() => Filter)
  @IsArray()
  @Transform(({ value }) => {
    if (value instanceof Array) {
      return value;
    }
    if (value) value = value.replace(/\\/g, '');

    if (isJson(value)) {
      const decodedData = decodeURIComponent(value);
      return JSON.parse(decodedData);
    }
  })
  filter?: Filter[];

  @ApiPropertyOptional({
    example: [{ columm: 'name', order: 'DESC' }],
    description: '',
  })
  @Type(() => Sort)
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (value instanceof Array) {
      return value;
    }
    if (value) value = value.replace(/\\/g, '');

    if (isJson(value)) {
      const decodedData = decodeURIComponent(value);
      return JSON.parse(decodedData);
    }
  })
  sort?: Sort[];

  get take(): number {
    const limit = Number(this.limit) || 10;
    return limit > 0 ? limit : 10;
  }

  get skip(): number {
    const page = (Number(this.page) || 1) - 1;
    return (page < 0 ? 0 : page) * this.take;
  }

  getTake(): number {
    const limit = Number(this.limit) || 10;
    return limit > 0 ? limit : 10;
  }

  getSkip(): number {
    const page = (Number(this.page) || 1) - 1;
    return (page < 0 ? 0 : page) * this.take;
  }
}
