export type DashboardTrendMode = 'day' | 'week' | 'month' | string;

export interface DashboardOverviewQuery {
  trendMode?: DashboardTrendMode;
}

export interface DashboardRevenueTrendItem {
  label: string;
  date?: string;
  amount: number | string;
}

export interface DashboardPendingItem {
  key: string;
  label: string;
  status?: string;
  count: number;
  tone?: string;
}

export interface DashboardRecentOrder {
  orderNo: string;
  status: string;
  statusLabel: string;
  createTime?: string;
}

export interface DashboardTopChef {
  chefId: number;
  chefName: string;
  rating: number | string;
  completedOrders: number;
  avatarUrl?: string;
}

export interface DashboardOverviewVO {
  todayOrders: number;
  todayRevenue: number | string;
  serviceChefCount: number;
  resignedChefCount: number;
  registeredUserCount: number;
  todayNewUserCount: number;
  trendMode: DashboardTrendMode;
  revenueTrend: DashboardRevenueTrendItem[];
  pendingItems: DashboardPendingItem[];
  recentOrders: DashboardRecentOrder[];
  topRatedChefs: DashboardTopChef[];
}
