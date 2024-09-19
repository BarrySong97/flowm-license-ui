/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import {
  License,
  LicenseCreate,
  LicenseQuery,
  LicenseUpdate,
} from '../models/license';
import { Page } from '../models/page';

export class LicenseService {
  // 获取许可证列表
  public static ListLicense(
    params: LicenseQuery,
  ): CancelablePromise<Page<License>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/license',
      query: params,
    });
  }
  // 创建许可证
  public static CreateLicense(data: LicenseCreate): CancelablePromise<License> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/license',
      body: data,
    });
  }

  // 更新许可证
  public static UpdateLicense(
    id: string,
    data: LicenseUpdate,
  ): CancelablePromise<License> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: `/license/${id}`,
      body: data,
    });
  }

  // 删除许可证
  public static DeleteLicense(id: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `/license/${id}`,
    });
  }
}
