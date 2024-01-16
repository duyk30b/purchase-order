export interface UserServiceInterface {
  getList(filter: any): Promise<any>;
  getListFactoryManager(factoryId: number): Promise<any>;
  getDetailUser(id: number): Promise<any>;
  detailCompany(id: number): Promise<any>;
  getFactoryList(filter?: any, keyword?: string): Promise<any>;
  getFactoryListWithPagination(
    filter?: any,
    page?: number,
    limit?: number,
  ): Promise<any>;
  getFactoryById(id: number, serilize?: boolean): Promise<any>;
  updateStatusFactories(regionIds: string[], status: number): Promise<any>;
  insertPermission(permissions): Promise<any>;
  deletePermissionNotActive(): Promise<any>;
  syncFactories(data: any): Promise<any>;
  getUserByIds(userIds: number[], serilize?: boolean): Promise<any>;
  getUsersByNameKeyword(nameKeyword: any, onlyId?: boolean): Promise<any>;
  getDepartmentSettingByIds(ids: number[], serilize?: boolean): Promise<any>;
}
