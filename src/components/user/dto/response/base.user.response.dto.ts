import { Expose } from 'class-transformer';

export class BaseUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  fullName: string;
}
