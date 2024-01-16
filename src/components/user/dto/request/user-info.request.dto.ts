import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

class WarehouseResponse {
  @IsNotEmpty()
  id: number;
}

class UserRoleSettingResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsNotBlank()
  name: string;

  @IsNotEmpty()
  @IsNotBlank()
  code: string;
}

class FactoryResponse {
  @IsNotEmpty()
  id: number;
}

class DepartmentSettingResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: string;
}
export class UserInforRequestDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsNotBlank()
  email: string;

  @IsNotEmpty()
  @IsNotBlank()
  username: string;

  @IsNotEmpty()
  @IsNotBlank()
  fullName: string;

  @IsNotEmpty()
  companyId: number;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsNotBlank()
  code: string;

  @IsNotEmpty()
  @IsNotBlank()
  phone: string;

  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  updatedAt: string;

  @IsNotEmpty()
  @Type(() => WarehouseResponse)
  userWarehouses: WarehouseResponse[];

  @IsNotEmpty()
  @Type(() => UserRoleSettingResponse)
  userRoleSettings: UserRoleSettingResponse[];

  @IsNotEmpty()
  @Type(() => DepartmentSettingResponse)
  departmentSettings: DepartmentSettingResponse[];

  @IsNotEmpty()
  @Type(() => FactoryResponse)
  factories: FactoryResponse[];
}
