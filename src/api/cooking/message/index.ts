import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MessageForm, MessageQuery, MessageVO } from './types';

export const listMessage = (query?: MessageQuery): AxiosPromise<MessageVO[]> => request({ url: '/cooking/message/list', method: 'get', params: query });
export const getMessage = (messageId: string | number): AxiosPromise<MessageVO> => request({ url: `/cooking/message/${messageId}`, method: 'get' });
export const addMessage = (data: MessageForm) => request({ url: '/cooking/message', method: 'post', data });
export const updateMessage = (data: MessageForm) => request({ url: '/cooking/message', method: 'put', data });
export const delMessage = (messageIds: string | number | Array<string | number>) => request({ url: `/cooking/message/${messageIds}`, method: 'delete' });
