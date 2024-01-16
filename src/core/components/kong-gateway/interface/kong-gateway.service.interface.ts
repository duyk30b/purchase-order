export interface KongGatewayServiceInterface {
  init(): Promise<any>;
  createOrUpdateService(host: string): Promise<any>;
  createOrUpdateRoute(host: string): Promise<any>;
}
