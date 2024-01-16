import { FactoryBasicResponse } from '@utils/dto/response/factory.basic.response';

export class AuthorizedRequest {
  isAdmin: boolean;
  isFactoryManager: boolean;
  isTeamLeader: boolean;
  isTeamMember: boolean;
  isOther: boolean;
  factories: FactoryBasicResponse[];
  factoryIds: number[];
}

export class AuthorizedRequestDto {
  authorized: AuthorizedRequest;
}
