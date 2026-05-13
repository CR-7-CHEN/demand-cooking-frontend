<template>
  <div class="app-container home">
    <section class="overview-header">
      <div>
        <p class="eyebrow">后台首页</p>
        <h1>运营总览</h1>
      </div>
      <div class="today">{{ todayText }}</div>
    </section>

    <section class="stats-grid" aria-label="关键统计">
      <article v-for="card in statsCards" :key="card.label" class="stat-card" :class="{ primary: card.primary }">
        <div class="stat-card__label">{{ card.label }}</div>
        <div class="stat-card__value">
          {{ card.value }}
          <span v-if="card.unit">{{ card.unit }}</span>
        </div>
        <div class="stat-card__sub">{{ card.sub }}</div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel trend-panel" :class="{ loading: loading }">
        <div class="panel__header">
          <div>
            <h2>营收趋势（近7天）</h2>
            <p>{{ trendSubtitle }}</p>
          </div>
        </div>

        <div class="trend-chart" aria-label="近7天营收柱状图">
          <div v-for="bar in trendBars" :key="bar.label" class="trend-chart__item">
            <div class="trend-chart__bar-wrap">
              <div class="trend-chart__bar" :style="{ height: `${bar.percent}%` }">
                <span>{{ bar.amount }}</span>
              </div>
            </div>
            <div class="trend-chart__label">{{ bar.label }}</div>
          </div>
        </div>
      </article>

      <aside class="side-panels">
        <article class="panel">
          <div class="panel__header compact">
            <h2>待处理事项</h2>
          </div>
          <div class="pending-list">
            <div
              v-for="item in pendingItems"
              :key="item.key"
              class="pending-item"
              :class="{ clickable: isPendingItemClickable(item) }"
              @click="handlePendingItemClick(item)"
            >
              <span class="pending-item__dot" :class="item.tone"></span>
              <span class="pending-item__label">{{ item.label }}</span>
              <strong>{{ formatCount(item.count) }}</strong>
            </div>
          </div>
        </article>

        <article class="panel recent-orders-panel">
          <div class="panel__header compact">
            <h2>最新订单</h2>
            <button type="button" class="panel-link" @click="handleViewAllOrders">查看全部</button>
          </div>
          <div v-if="recentOrders.length" class="order-list recent-orders-scroll">
            <div v-for="order in recentOrders" :key="order.orderNo" class="order-item">
              <span class="order-item__no">{{ order.orderNo }}</span>
              <span class="order-item__status" :class="order.tone">{{ order.statusLabel }}</span>
            </div>
          </div>
          <div v-else class="empty-state">暂无最新订单</div>
        </article>

        <article class="panel">
          <div class="panel__header compact">
            <h2>好评厨师 Top5</h2>
          </div>
          <div v-if="topRatedChefs.length" class="chef-rank-list">
            <div v-for="(chef, index) in topRatedChefs" :key="chef.chefId" class="chef-rank-item">
              <span class="chef-rank-item__index" :class="{ gold: index === 0, silver: index === 1, bronze: index === 2 }">{{ index + 1 }}</span>
              <span class="chef-rank-item__name">{{ chef.chefName }}</span>
              <span class="chef-rank-item__rating">{{ formatRating(chef.rating) }} 分</span>
              <span class="chef-rank-item__orders">{{ formatCount(chef.completedOrders) }} 单</span>
            </div>
          </div>
          <div v-else class="empty-state">暂无厨师数据</div>
        </article>
      </aside>
    </section>
  </div>
</template>

<script setup name="Index" lang="ts">
import { getDashboardOverview } from '@/api/cooking/dashboard';
import type { DashboardOverviewVO, DashboardPendingItem, DashboardRecentOrder, DashboardTopChef } from '@/api/cooking/dashboard/types';
import { cookingComplaintStatus, orderStatusText, orderStatusTone } from '@/api/cooking/status';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

type DisplayPendingItem = Required<Pick<DashboardPendingItem, 'key' | 'label' | 'count' | 'tone'>>;
type DisplayRecentOrder = DashboardRecentOrder & { tone: string };

const defaultOverview: DashboardOverviewVO = {
  todayOrders: 0,
  todayRevenue: 0,
  serviceChefCount: 0,
  resignedChefCount: 0,
  registeredUserCount: 0,
  todayNewUserCount: 0,
  trendMode: 'week',
  revenueTrend: [],
  pendingItems: [],
  recentOrders: [],
  topRatedChefs: []
};

const defaultPendingItems: DisplayPendingItem[] = [
  { key: 'chefAudit', label: '厨师审核待处理', count: 0, tone: 'danger' },
  { key: 'complaintReply', label: '用户投诉待处理', count: 0, tone: 'warning' },
  { key: 'chefService', label: '厨师待服务', count: 0, tone: 'success' }
];

const dashboard = ref<DashboardOverviewVO>({ ...defaultOverview });
const trendMode = ref('week');
const loading = ref(false);
const router = useRouter();
let requestSeq = 0;

const pendingItemRoutes: Record<string, { path: string; query: Record<string, string> }> = {
  chefAudit: { path: '/cooking/chef', query: { auditStatus: '0' } },
  complaintReply: { path: '/cooking/complaint', query: { status: cookingComplaintStatus.PENDING } }
};

const todayText = computed(() => {
  const now = new Date();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day} ${weekdays[now.getDay()]}`;
});

const trendSubtitle = '近7天运营收入变化';

const statsCards = computed(() => [
  { label: '今日订单', value: formatCount(dashboard.value.todayOrders), unit: '单', sub: '今日已创建订单', primary: true },
  { label: '今日营收', value: formatCurrency(dashboard.value.todayRevenue), unit: '', sub: '已支付订单收入' },
  { label: '服务中厨师', value: formatCount(dashboard.value.serviceChefCount), unit: '人', sub: '当前可承接服务' },
  { label: '已离职厨师', value: formatCount(dashboard.value.resignedChefCount), unit: '人', sub: '已退出服务人员' },
  { label: '注册用户', value: formatCount(dashboard.value.registeredUserCount), unit: '人', sub: `今日新增 +${formatCount(dashboard.value.todayNewUserCount)}` }
]);

const trendBars = computed(() => {
  const source = normalizeTrend(dashboard.value.revenueTrend);
  const maxAmount = Math.max(...source.map((item) => toNumber(item.amount)), 0);

  return source.map((item) => {
    const amount = toNumber(item.amount);
    const percent = maxAmount > 0 ? Math.max(Math.round((amount / maxAmount) * 100), 8) : 8;
    return {
      label: item.date ? formatTrendDate(item.date) : item.label || '-',
      amount: formatTrendAmount(item.amount),
      percent
    };
  });
});

const pendingItems = computed<DisplayPendingItem[]>(() => {
  const apiItems = Array.isArray(dashboard.value.pendingItems) ? dashboard.value.pendingItems : [];
  const used = new Set<DashboardPendingItem>();
  const baseItems = defaultPendingItems.map((defaultItem) => {
    const matched = apiItems.find((item) => item.key === defaultItem.key || item.label === defaultItem.label);
    if (matched) {
      used.add(matched);
    }
    return {
      ...defaultItem,
      ...matched,
      count: toNumber(matched?.count ?? defaultItem.count),
      tone: matched?.tone || defaultItem.tone
    };
  });

  const extraItems = apiItems
    .filter((item) => !used.has(item))
    .map((item, index) => ({
      key: item.key || `pending-${index}`,
      label: item.label || '-',
      count: toNumber(item.count),
      tone: item.tone || 'info'
    }));

  return [...baseItems, ...extraItems];
});

const isPendingItemClickable = (item: DisplayPendingItem) => Boolean(pendingItemRoutes[item.key]);

const handlePendingItemClick = (item: DisplayPendingItem) => {
  const target = pendingItemRoutes[item.key];
  if (target) {
    router.push(target);
  }
};

const handleViewAllOrders = () => {
  router.push('/cooking/order');
};

const topRatedChefs = computed<DashboardTopChef[]>(() => {
  return Array.isArray(dashboard.value.topRatedChefs) ? dashboard.value.topRatedChefs : [];
});

const recentOrders = computed<DisplayRecentOrder[]>(() => {
  const orders = Array.isArray(dashboard.value.recentOrders) ? dashboard.value.recentOrders : [];
  return orders.map((order) => ({
    ...order,
    orderNo: order.orderNo || '-',
    statusLabel: recentOrderStatusText(order),
    tone: orderTone(order.status)
  }));
});

const loadDashboard = async () => {
  const seq = ++requestSeq;
  loading.value = true;
  try {
    const res = (await getDashboardOverview({ trendMode: trendMode.value })) as any;
    if (seq !== requestSeq) return;
    const data = (res?.data || res || {}) as Partial<DashboardOverviewVO>;
    dashboard.value = {
      ...defaultOverview,
      ...data,
      trendMode: data.trendMode || trendMode.value,
      revenueTrend: Array.isArray(data.revenueTrend) ? data.revenueTrend : [],
      pendingItems: Array.isArray(data.pendingItems) ? data.pendingItems : [],
      recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
      topRatedChefs: Array.isArray(data.topRatedChefs) ? data.topRatedChefs : []
    };
  } catch (error) {
    if (seq === requestSeq) {
      dashboard.value = { ...defaultOverview, trendMode: trendMode.value };
      console.warn('Dashboard overview load failed:', error);
    }
  } finally {
    if (seq === requestSeq) {
      loading.value = false;
    }
  }
};

const parseTrendDate = (value?: string) => {
  if (!value) return null;
  const normalized = value.trim();
  const match = normalized.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatMonthDay = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}.${day}`;
};

const formatTrendDate = (value?: string) => {
  const date = parseTrendDate(value);
  return date ? formatMonthDay(date) : '';
};

const buildRecentTrendLabels = (length: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (length - 1 - index));
    return formatMonthDay(date);
  });
};

const normalizeTrend = (items: DashboardOverviewVO['revenueTrend']) => {
  const safeItems = Array.isArray(items) ? items.slice(0, 7) : [];
  const fallbackLabels = buildRecentTrendLabels(7);

  return Array.from({ length: 7 }, (_, index) => ({
    label: safeItems[index]?.date ? formatTrendDate(safeItems[index].date) : safeItems[index]?.label || fallbackLabels[index],
    date: safeItems[index]?.date,
    amount: safeItems[index]?.amount ?? 0
  }));
};

const toNumber = (value: number | string | undefined | null) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatCount = (value: number | string | undefined | null) => new Intl.NumberFormat('zh-CN').format(toNumber(value));

const formatRating = (value: number | string | undefined | null) => {
  const num = toNumber(value);
  return num.toFixed(1);
};

const formatCurrency = (value: number | string | undefined | null) => `¥${new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(toNumber(value))}`;

const formatTrendAmount = (value: number | string | undefined | null) => {
  const amount = toNumber(value);
  if (Math.abs(amount) >= 1000) {
    return `¥${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return formatCurrency(amount);
};

const recentOrderStatusText = (order: DashboardRecentOrder) => {
  const statusCandidates = [order.status, order.statusLabel]
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));

  for (const candidate of statusCandidates) {
    const mapped = orderStatusText(candidate);
    if (mapped) {
      return mapped;
    }
  }

  return order.statusLabel || order.status || '-';
};

const orderTone = orderStatusTone;

onMounted(loadDashboard);
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: clamp(12px, 2vw, 24px);
  overflow-x: hidden;
  color: #2f2a24;
  background: #f6f3ef;
}

.overview-header {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;

  h1 {
    margin: 2px 0 0;
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 700;
    line-height: 1.2;
  }
}

.eyebrow,
.today,
.panel__header p,
.stat-card__label,
.stat-card__sub,
.trend-chart__label,
.empty-state {
  color: #7a7168;
}

.eyebrow {
  margin: 0;
  font-size: 13px;
}

.today {
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  min-width: 0;
  margin-bottom: 14px;
}

.stat-card,
.panel {
  min-width: 0;
  border: 1px solid #e4ddd4;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 20px rgb(47 42 36 / 5%);
}

.stat-card {
  padding: 16px;

  &.primary {
    border-color: #d86f47;
    color: #fff;
    background: #df7b50;

    .stat-card__label,
    .stat-card__sub,
    .stat-card__value span {
      color: #fff4ed;
    }
  }
}

.stat-card__label {
  font-size: 13px;
}

.stat-card__value {
  margin-top: 6px;
  overflow-wrap: anywhere;
  font-size: clamp(24px, 3.4vw, 32px);
  font-weight: 700;
  line-height: 1.1;

  span {
    margin-left: 4px;
    color: #7a7168;
    font-size: 14px;
    font-weight: 400;
  }
}

.stat-card__sub {
  min-height: 18px;
  margin-top: 8px;
  font-size: 12px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 14px;
  min-width: 0;
}

.panel {
  padding: clamp(14px, 2vw, 18px);
}

.trend-panel.loading {
  opacity: 0.86;
}

.panel__header {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  &.compact {
    margin-bottom: 10px;
  }

  h2 {
    margin: 0;
    font-size: 16px;
    line-height: 1.3;
  }

  p {
    margin: 4px 0 0;
    font-size: 12px;
  }
}

.trend-chart {
  display: grid;
  grid-template-columns: repeat(7, minmax(32px, 1fr));
  gap: clamp(8px, 2vw, 18px);
  min-width: 0;
  height: clamp(230px, 34vw, 330px);
  padding: 12px 4px 0;
}

.trend-chart__item {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 22px;
  min-width: 0;
}

.trend-chart__bar-wrap {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 0;
  border-bottom: 1px solid #ebe3da;
}

.trend-chart__bar {
  position: relative;
  width: min(72%, 46px);
  min-height: 24px;
  border-radius: 6px 6px 0 0;
  background: #c8b89a;
  transition: height 0.2s ease;

  span {
    position: absolute;
    top: -22px;
    left: 50%;
    color: #6c6258;
    font-size: 11px;
    white-space: nowrap;
    transform: translateX(-50%);
  }
}

.trend-chart__item:nth-child(6) .trend-chart__bar {
  background: #df7b50;
}

.trend-chart__label {
  padding-top: 6px;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.panel-link {
  border: 0;
  color: #c8613f;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.4;

  &:hover {
    color: #a84e31;
  }
}

.side-panels {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.pending-list,
.order-list {
  display: grid;
  gap: 8px;
}

.recent-orders-panel {
  display: flex;
  flex-direction: column;
  height: 280px;
}

.recent-orders-scroll {
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.pending-item,
.order-item {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 10px 0;
  border-bottom: 1px dashed #ece5dc;

  &:last-child {
    border-bottom: 0;
  }
}

.pending-item.clickable {
  cursor: pointer;
  border-radius: 6px;
  transition:
    background-color 0.16s ease,
    transform 0.16s ease;

  &:hover {
    background: #fff5ed;
    transform: translateX(2px);
  }
}

.pending-item__dot {
  flex: 0 0 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.danger {
    background: #df7b50;
  }

  &.warning {
    background: #d0a448;
  }

  &.success {
    background: #67a66a;
  }

  &.info {
    background: #8aa0b2;
  }
}

.pending-item__label,
.order-item__no {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pending-item__label {
  flex: 1;
}

.pending-item strong {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  color: #fff;
  background: #df7b50;
  font-size: 13px;
}

.order-item {
  justify-content: space-between;
}

.order-item__status {
  flex: 0 0 auto;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12px;

  &.progress {
    color: #c8613f;
    background: #fff0e8;
  }

  &.success {
    color: #4f8f52;
    background: #eef8ef;
  }

  &.warning {
    color: #a37822;
    background: #fff8df;
  }

  &.danger {
    color: #b95050;
    background: #fff0f0;
  }
}

.empty-state {
  padding: 24px 0 12px;
  font-size: 13px;
  text-align: center;
}

.chef-rank-list {
  display: grid;
  gap: 4px;
}

.chef-rank-item {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 9px 0;
  border-bottom: 1px dashed #ece5dc;

  &:last-child {
    border-bottom: 0;
  }
}

.chef-rank-item__index {
  display: inline-flex;
  flex: 0 0 24px;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: #7a7168;
  background: #f0ebe4;
  font-size: 13px;
  font-weight: 700;

  &.gold {
    color: #fff;
    background: #df7b50;
  }

  &.silver {
    color: #fff;
    background: #c8a96a;
  }

  &.bronze {
    color: #fff;
    background: #c8b89a;
  }
}

.chef-rank-item__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chef-rank-item__rating {
  flex: 0 0 auto;
  color: #df7b50;
  font-size: 13px;
  font-weight: 600;
}

.chef-rank-item__orders {
  flex: 0 0 auto;
  color: #7a7168;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .side-panels {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
}

@media (max-width: 640px) {
  .home {
    padding: 12px;
  }

  .stats-grid,
  .side-panels {
    grid-template-columns: 1fr;
  }

  .trend-chart {
    gap: 6px;
    height: 230px;
  }

  .trend-chart__bar {
    width: 80%;

    span {
      display: none;
    }
  }
}
</style>
