export interface HttpClientServiceInterface {
  get(url: string, params?: any): Promise<any>;
  post(url: string, body?: any): Promise<any>;
  put(url: string, body?: any): Promise<any>;
  delete(url: string, params?: any): Promise<any>;
  generateUrlInternalService(serviceName: string, url: string): Promise<string>;
}