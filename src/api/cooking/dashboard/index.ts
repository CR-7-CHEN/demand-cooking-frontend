import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import type { DashboardOverviewQuery, DashboardOverviewVO } from './types';

export const getDashboardOverview = (query?: DashboardOverviewQuery): AxiosPromise<DashboardOverviewVO> =>
  request({ url: '/cooking/dashboard/overview', method: 'get', params: query });
