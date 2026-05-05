export interface ReviewQuery extends PageQuery {
  reviewId?: string | number;
  orderId?: string | number;
  orderNo?: string;
  userId?: string | number;
  userKeyword?: string;
  chefId?: string | number;
  chefName?: string;
  displayStatus?: string;
  params?: Record<string, any>;
}

export interface ReviewVO extends BaseEntity {
  reviewId?: string | number;
  orderId?: string | number;
  orderNo?: string;
  userId?: string | number;
  userName?: string;
  nickName?: string;
  chefId?: string | number;
  chefName?: string;
  rating?: number | string;
  content?: string;
  imageUrls?: string;
  displayStatus?: string;
  complaintAdjusted?: string;
  reviewTime?: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}

export type ReviewForm = ReviewVO;
