export interface AuthServiceInterface {
  validateToken(token: string, permissionCode: string): Promise<any>;
}
