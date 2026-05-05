export interface AreaVO {
  areaId?: string | number;
  areaCode?: string;
  areaName?: string;
  parentCode?: string;
  areaLevel?: string;
  status?: string;
  sort?: number;
  remark?: string;
  createTime?: string;
  [key: string]: any;
}

export interface AreaQuery extends PageQuery {
  areaCode?: string;
  areaName?: string;
  parentCode?: string;
  areaLevel?: string;
  status?: string;
  [key: string]: any;
}

export type AreaForm = AreaVO;
