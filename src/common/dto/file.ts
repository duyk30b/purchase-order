import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsIn, IsNumber, IsString } from 'class-validator'

export class MultipleFileUpload {
  @ApiProperty({ type: Array, format: 'binary' })
  files: string[]
}

export class SingleFileUpload {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: string
}

export class FileDto {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}
