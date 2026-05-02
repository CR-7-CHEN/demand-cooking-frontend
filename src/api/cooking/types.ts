export interface CookingBaseQuery extends PageQuery {
  [key: string]: any;
}

export interface CookingBaseForm {
  [key: string]: any;
}

export interface ChefVO extends CookingBaseForm {
  chefId?: string | number;
  userId?: string | number;
  chefName?: string;
  mobile?: string;
  areaName?: string;
  skillTags?: string;
  healthCertExpireDate?: string;
  baseSalary?: number;
  rating?: number;
  completedOrders?: number;
  recommendFlag?: string;
  auditStatus?: string;
  chefStatus?: string;
}

export interface OrderVO extends CookingBaseForm {
  orderId?: string | number;
  orderNo?: string;
  userId?: string | number;
  chefId?: string | number;
  contactName?: string;
  contactPhone?: string;
  serviceArea?: string;
  serviceStartTime?: string;
  status?: string;
  quoteAmount?: number;
  payAmount?: number;
}

export interface DishVO extends CookingBaseForm {
  dishId?: string | number;
  dishName?: string;
  category?: string;
  cuisine?: string;
  status?: string;
  sort?: number;
}

export interface ComplaintVO extends CookingBaseForm {
  complaintId?: string | number;
  orderId?: string | number;
  orderNo?: string;
  userId?: string | number;
  chefId?: string | number;
  complaintType?: string;
  status?: string;
}

export interface SettlementVO extends CookingBaseForm {
  settlementId?: string | number;
  chefId?: string | number;
  settlementMonth?: string;
  orderCount?: number;
  orderAmount?: number;
  payableAmount?: number;
  status?: string;
}

export interface ConfigVO extends CookingBaseForm {
  configId?: string | number;
  configName?: string;
  configKey?: string;
  configValue?: string;
  configType?: string;
  publishStatus?: string;
}
