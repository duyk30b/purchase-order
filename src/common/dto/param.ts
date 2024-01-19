import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator'

export class IdNumberParam {
  @ApiProperty({ name: 'id', example: 45 })
  @Expose({ name: 'id' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number
}

export class IdMongoParam {
  @ApiProperty({ name: 'id', example: '63fdde9517a7317f0e8f959a' })
  @Expose({ name: 'id' })
  @IsNotEmpty()
  @IsMongoId()
  id: string
}
