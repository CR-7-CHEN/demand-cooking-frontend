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
  gender?: string;
  age?: number;
  mobile?: string;
  avatarUrl?: string;
  workImageUrls?: string;
  areaName?: string;
  skillTags?: string;
  healthCertImageUrl?: string;
  healthCertExpireDate?: string;
  baseSalary?: number;
  rating?: number;
  completedOrders?: number;
  recommendFlag?: string;
  auditStatus?: string;
  chefStatus?: string;
  resignReason?: string;
  availableTimeText?: string;
  availableTimes?: ChefTimeVO[];
}

export interface ChefTimeVO extends CookingBaseForm {
  timeId?: string | number;
  chefId?: string | number;
  startTime?: string;
  endTime?: string;
  status?: string;
  remark?: string;
}

export interface OrderVO extends CookingBaseForm {
  orderId?: string | number;
  orderNo?: string;
  userId?: string | number;
  userName?: string;
  nickName?: string;
  chefId?: string | number;
  chefName?: string;
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
  imageUrl?: string;
  description?: string;
}

export interface ComplaintVO extends CookingBaseForm {
  complaintId?: string | number;
  orderId?: string | number;
  orderNo?: string;
  userId?: string | number;
  chefId?: string | number;
  chefName?: string;
  complaintType?: string;
  status?: string;
}

export interface SettlementVO extends CookingBaseForm {
  settlementId?: string | number;
  chefId?: string | number;
  chefName?: string;
  settlementMonth?: string;
  orderCount?: number;
  orderAmount?: number;
  baseSalary?: number;
  violationCount?: number;
  violationDeduction?: number;
  payableAmount?: number;
  status?: string;
  reviewReason?: string;
  reviewReasonType?: string;
  reviewRemark?: string;
  reviewAction?: string;
  reviewResult?: string;
  reviewReply?: string;
  reviewApplyTime?: string;
  reviewHandleTime?: string;
  confirmTime?: string;
  payTime?: string;
}

export interface ConfigVO extends CookingBaseForm {
  configId?: string | number;
  configName?: string;
  configKey?: string;
  configValue?: string;
  configType?: string;
  publishStatus?: string;
}
