import { NatsService } from '@config/nats.config';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { NatsClientService } from '@components/nats-transporter/nats-client.service';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isEmpty, keyBy, map, uniq } from 'lodash';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UserServiceInterface } from './interface/user.service.interface';
import {
  DEPARTMENT_SETTING_CONSTANT,
  USER_ROLE_SETTING_CONSTANT,
} from './user.constant';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(private readonly natsClientService: NatsClientService) {}

  async insertPermission(permissions): Promise<any> {
    return await this.natsClientService.send(
      `${NatsService.USER}.insert_permission`,
      permissions,
    );
  }

  async deletePermissionNotActive(): Promise<any> {
    return await this.natsClientService.send(
      `${NatsService.USER}.delete_permission_not_active`,
      {},
    );
  }

  async getFactoryList(filter?: any, keyword?: string): Promise<any> {
    const params = {
      isGetAll: '1',
      filter: filter,
      isMasterData: '1',
      keyword: keyword,
    };
    try {
      const response = await this.natsClientService.send(
        `${NatsService.USER}.list_factories`,
        params,
      );
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data.items;
    } catch (err) {
      return [];
    }
  }

  async getFactoryListWithPagination(
    filter?: any,
    page?: number,
    limit?: number,
  ): Promise<any> {
    const params = {
      page: page || 1,
      limit: limit || 10,
      filter: filter,
    };
    try {
      const response = await this.natsClientService.send(
        `${NatsService.USER}.list_factories`,
        params,
      );
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      return response.data;
    } catch (err) {
      return [];
    }
  }

  async getFactoryById(id: number, serialize?: boolean): Promise<any> {
    try {
      const response = await this.natsClientService.send(
        `${NatsService.USER}.detail_factory`,
        {
          id,
        },
      );
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return serialize ? {} : [];
      }
      return serialize ? keyBy(response.data, 'id') : response.data;
    } catch (err) {
      return null;
    }
  }

  async updateStatusFactories(
    regionIds: string[],
    status: number,
  ): Promise<any> {
    try {
      const response = await this.natsClientService.send(
        `${NatsService.USER}.update_many_status`,
        {
          regionIds,
          status,
        },
      );
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return null;
      }
      return response.data;
    } catch (err) {
      return null;
    }
  }

  async detailCompany(id: number): Promise<any> {
    return await this.natsClientService.send(
      `${NatsService.USER}.company_detail`,
      {
        id: id,
      },
    );
  }

  async getDetailUser(id: number): Promise<any> {
    try {
      const response = await this.natsClientService.send(
        `${NatsService.USER}.detail`,
        {
          id: +id,
        },
      );

      return response?.data;
    } catch (err) {
      return null;
    }
  }

  async getList(filter: any): Promise<any> {
    try {
      const response = await this.natsClientService.send(
        `${NatsService.USER}.list`,
        {
          filter,
        },
      );

      return response?.data?.items || [];
    } catch (err) {
      return [];
    }
  }

  async getListFactoryManager(factoryId: any): Promise<any> {
    try {
      const response = await this.natsClientService.send(
        `${NatsService.USER}.list`,
        {
          filter: [
            { column: 'factoryId', text: factoryId },
            { column: 'roleCode', text: USER_ROLE_SETTING_CONSTANT.ADMIN },
            { column: 'departmentCode', text: DEPARTMENT_SETTING_CONSTANT.ME },
          ],
        },
      );

      return response?.data?.items || [];
    } catch (err) {
      return [];
    }
  }

  async syncFactories(data: any): Promise<any> {
    try {
      const response = await this.natsClientService.send(
        `${NatsService.USER}.sync_factories`,
        {
          factorySyncs: data,
        },
      );
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return null;
      }
      return response.data;
    } catch (err) {
      return null;
    }
  }

  async getUserByIds(userIds: number[], serilize?: boolean): Promise<any> {
    const response = await this.natsClientService.send(
      `${NatsService.USER}.get_users_by_ids`,
      {
        userIds: userIds,
      },
    );
    if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];

    const dataReturn = plainToInstance(UserResponseDto, <any[]>response.data, {
      excludeExtraneousValues: true,
    });
    const serilizeUsers = {};
    if (serilize) {
      response.data.forEach((user) => {
        serilizeUsers[user.id] = user;
      });

      return serilizeUsers;
    }
    return dataReturn;
  }

  async getUsersByNameKeyword(nameKeyword, onlyId?: boolean): Promise<any> {
    if (isEmpty(nameKeyword)) {
      return [];
    }

    const response = await this.natsClientService.send(
      `${NatsService.USER}.get_users_by_name_keyword`,
      {
        nameKeyword,
      },
    );

    if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
      return [];
    }

    if (onlyId) {
      return uniq(map(response.data, 'id'));
    }

    return response.data;
  }

  async getDepartmentSettingByIds(
    ids: number[],
    serilize?: boolean,
  ): Promise<any> {
    const response = await this.natsClientService.send(
      `${NatsService.USER}.get_department_setting_by_ids`,
      {
        departmentSettingIds: ids,
      },
    );
    if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];

    return serilize ? keyBy(response.data, 'id') : response.data;
  }
}
