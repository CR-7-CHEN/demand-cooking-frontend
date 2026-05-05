import type { CookingBaseForm, CookingBaseQuery } from '../types';

export interface AddressVO extends CookingBaseForm {
  addressId?: string | number;
  userId?: string | number;
  userKeyword?: string;
  userName?: string;
  nickName?: string;
  contactName?: string;
  contactPhone?: string;
  areaCode?: string;
  areaName?: string;
  detailAddress?: string;
  houseNumber?: string;
  longitude?: number;
  latitude?: number;
  defaultFlag?: string;
  sourceAddressId?: string | number;
  snapshotType?: string;
  snapshotTime?: string;
  remark?: string;
  createTime?: string;
}

export interface AddressQuery extends CookingBaseQuery {
  addressId?: string | number;
  userId?: string | number;
  userKeyword?: string;
  userName?: string;
  nickName?: string;
  contactName?: string;
  contactPhone?: string;
  areaName?: string;
  defaultFlag?: string;
}

export type AddressForm = AddressVO;
