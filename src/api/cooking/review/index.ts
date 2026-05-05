import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ReviewForm, ReviewQuery, ReviewVO } from './types';

export const listReview = (query?: ReviewQuery): AxiosPromise<ReviewVO[]> => request({ url: '/cooking/review/list', method: 'get', params: query });
export const getReview = (reviewId: string | number): AxiosPromise<ReviewVO> => request({ url: `/cooking/review/${reviewId}`, method: 'get' });
export const addReview = (data: ReviewForm) => request({ url: '/cooking/review', method: 'post', data });
export const hideReview = (reviewId: string | number) => request({ url: `/cooking/review/hide/${reviewId}`, method: 'put' });
