import { Expose } from 'class-transformer';

export class ListUserReportJobResponse {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  fullName: string;

  @Expose()
  code: string;

  @Expose({ name: 'createdAt' })
  startWork: Date;
}
