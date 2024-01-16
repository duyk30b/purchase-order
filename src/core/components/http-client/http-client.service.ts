import { InjectService } from '@nestcloud/service';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { genericRetryStrategy } from '@utils/rxjs-util';
import { catchError, firstValueFrom, map, of, retry } from 'rxjs';
import { HttpClientServiceInterface } from './interface/http-client.service.interface';
import * as qs from 'qs';
import { ConfigService } from '@config/config.service';
@Injectable({ scope: Scope.REQUEST })
export class HttpClientService implements HttpClientServiceInterface {
  constructor(
    @InjectService()
    private readonly service: any,

    @Inject(REQUEST) private request: any,

    private httpService: HttpService,

    @Inject('ConfigServiceInterface')
    private configService: ConfigService,
  ) {
    if (this.httpService.axiosRef.defaults.headers)
      this.httpService.axiosRef.defaults.headers.common[
        'authorization'
      ] = `${request.headers?.authorization}`;
  }

  async generateUrlInternalService(
    serviceName: string,
    url: string,
  ): Promise<string> {
    const servers = this.service.getServiceServers(serviceName, {
      passing: true,
    });
    const server = servers[Math.floor(Math.random() * servers.length)];

    return `http://${server?.address}:${server?.port}${url}`;
  }

  async get(url: string, params?: any, options?: any): Promise<any> {
    if (options && options.callInternalService === true) {
      this.httpService.axiosRef.defaults.headers.common[
        'authorization'
      ] = `Bearer ${this.configService.get('internalToken')}`;
      url = await this.generateUrlInternalService(options.serviceName, url);
    }

    return await firstValueFrom(
      this.httpService
        .get(url, {
          params: params,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        })
        .pipe(
          map((response) => response.data),
          retry(genericRetryStrategy(options)),
          catchError((error) => of(error)),
        ),
    );
  }

  async post(url: string, body?: any, options?: any): Promise<any> {
    if (options && options.callInternalService === true) {
      this.httpService.axiosRef.defaults.headers.common[
        'authorization'
      ] = `Bearer ${this.configService.get('internalToken')}`;
      // url = await this.generateUrlInternalService(options.serviceName, url);
    }
    return await firstValueFrom(
      this.httpService.post(url, body).pipe(
        map((response) => response.data),
        retry(genericRetryStrategy(options)),
        catchError((error) => of(error)),
      ),
    );
  }

  async put(url: string, body?: any, options?: any): Promise<any> {
    if (options && options.callInternalService === true) {
      this.httpService.axiosRef.defaults.headers.common[
        'authorization'
      ] = `Bearer ${this.configService.get('internalToken')}`;
      url = await this.generateUrlInternalService(options.serviceName, url);
    }
    return await firstValueFrom(
      this.httpService.put(url, body).pipe(
        map((response) => response.data),
        retry(genericRetryStrategy(options)),
        catchError((error) => of(error)),
      ),
    );
  }
  async delete(url: string, params?: any, options?: any): Promise<any> {
    if (options && options.callInternalService === true) {
      this.httpService.axiosRef.defaults.headers.common[
        'authorization'
      ] = `Bearer ${this.configService.get('internalToken')}`;
      url = await this.generateUrlInternalService(options.serviceName, url);
    }

    return await firstValueFrom(
      this.httpService
        .delete(url, {
          params: params,
        })
        .pipe(
          map((response) => response.data),
          retry(
            genericRetryStrategy({
              scalingDuration: 1000,
              excludedStatusCodes: [409],
            }),
          ),
          catchError((error) => of(error)),
        ),
    );
  }
}
