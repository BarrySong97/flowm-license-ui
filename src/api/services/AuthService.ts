/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import axios from 'axios';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { Token } from '../models/token';
import { User } from '../models/user';

export class AuthService {
  // 登录
  public static login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): CancelablePromise<Token> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/login',
      body: { email, password },
      mediaType: 'application/json',
    });
  }
  // 获取当前用户
  public static getCurrentUser(): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/user',
    });
  }

  // 登出
  public static logout(): void {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    OpenAPI.TOKEN = '';
  }

  // 刷新 token
  public static async refreshToken(): Promise<Token | null> {
    if (!window.localStorage.getItem('refreshToken')) {
      return null;
    }
    const res = await axios.post('/api/auth/refresh-token', {
      token: window.localStorage.getItem('refreshToken'),
    });
    return res.data;
  }
}
