import { Expose } from 'class-transformer';

export class GetUserListResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
