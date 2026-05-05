<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="订单号">
          <el-input v-model="queryParams.orderNo" clearable placeholder="请输入订单号" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="queryParams.userKeyword" clearable placeholder="请输入用户" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="厨师姓名">
          <el-input v-model="queryParams.chefName" clearable placeholder="请输入厨师姓名" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="展示状态">
          <el-select v-model="queryParams.displayStatus" clearable placeholder="请选择" style="width: 150px">
            <el-option v-for="item in displayStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="评价时间">
          <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows" style="width: 100%">
        <el-table-column label="订单号" prop="orderNo" min-width="150" show-overflow-tooltip />
        <el-table-column label="用户" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">{{ userDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="厨师姓名" min-width="130" show-overflow-tooltip>
          <template #default="{ row }">{{ chefDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="评分" prop="rating" min-width="110">
          <template #default="{ row }">
            <el-rate :model-value="Number(row.rating || 0)" disabled allow-half />
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content" min-width="220" show-overflow-tooltip />
        <el-table-column label="图片" min-width="90">
          <template #default="{ row }">
            <ImagePreview v-if="row.imageUrls" :src="row.imageUrls" :width="48" :height="48" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="展示状态" prop="displayStatus" min-width="110">
          <template #default="{ row }">
            <el-tag :type="displayStatusTag(row.displayStatus)">{{ displayStatusText(row.displayStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评价时间" prop="reviewTime" min-width="170">
          <template #default="{ row }">{{ formatTime(row.reviewTime || row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="170">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="showDetail(row)">详情</el-button>
            <el-button v-if="!isHidden(row)" link type="warning" icon="Hide" @click="handleHide(row)">隐藏</el-button>
            <el-button v-else link type="info" disabled>已隐藏</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="detail.visible" title="评价详情" width="760px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="评价ID">{{ current.reviewId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="展示状态">{{ displayStatusText(current.displayStatus) }}</el-descriptions-item>
        <el-descriptions-item label="订单号">{{ current.orderNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="订单ID">{{ current.orderId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ userDisplay(current) }}</el-descriptions-item>
        <el-descriptions-item label="厨师姓名">{{ chefDisplay(current) }}</el-descriptions-item>
        <el-descriptions-item label="评分">{{ current.rating || '-' }}</el-descriptions-item>
        <el-descriptions-item label="投诉调整">{{ adjustedText(current.complaintAdjusted) }}</el-descriptions-item>
        <el-descriptions-item label="评价时间">{{ formatTime(current.reviewTime || current.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ formatTime(current.updateTime) }}</el-descriptions-item>
        <el-descriptions-item label="评价内容" :span="2">{{ current.content || '-' }}</el-descriptions-item>
        <el-descriptions-item label="图片" :span="2">
          <div v-if="imageList.length" class="review-images">
            <ImagePreview v-for="item in imageList" :key="item" :src="item" :width="72" :height="72" />
          </div>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ current.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="CookingReview" lang="ts">
import ImagePreview from '@/components/ImagePreview/index.vue';
import { getReview, hideReview, listReview } from '@/api/cooking/review';
import type { ReviewQuery, ReviewVO } from '@/api/cooking/review/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const loading = ref(false);
const rows = ref<ReviewVO[]>([]);
const total = ref(0);
const dateRange = ref<[string, string]>(['', '']);
const queryParams = reactive<ReviewQuery>({
  pageNum: 1,
  pageSize: 10,
  orderNo: '',
  userKeyword: '',
  chefName: '',
  displayStatus: ''
});
const detail = reactive({ visible: false });
const current = reactive<ReviewVO>({});

type DisplayStatusTagType = 'success' | 'info' | 'warning' | 'danger' | 'primary';

const displayStatusOptions: Array<{ label: string; value: string; type: DisplayStatusTagType }> = [
  { label: '展示中', value: 'SHOW', type: 'success' },
  { label: '已隐藏', value: 'HIDE', type: 'info' }
];

const getList = async () => {
  loading.value = true;
  try {
    const res: any = await listReview(proxy?.addDateRange({ ...queryParams }, dateRange.value));
    rows.value = res.rows || res.data || [];
    total.value = res.total || rows.value.length;
  } finally {
    loading.value = false;
  }
};

const resetQuery = () => {
  dateRange.value = ['', ''];
  Object.assign(queryParams, { pageNum: 1, orderNo: '', userKeyword: '', chefName: '', displayStatus: '' });
  getList();
};

const showDetail = async (row: ReviewVO) => {
  if (!row.reviewId) {
    Object.assign(current, row);
  } else {
    const res: any = await getReview(row.reviewId);
    Object.assign(current, res.data || res);
  }
  detail.visible = true;
};

const handleHide = async (row: ReviewVO) => {
  if (!row.reviewId) return;
  await proxy?.$modal.confirm(`是否确认隐藏订单"${row.orderNo || row.orderId || '-'}"的评价？`);
  await hideReview(row.reviewId);
  proxy?.$modal.msgSuccess('评价已隐藏');
  getList();
};

const imageList = computed(() =>
  String(current.imageUrls || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
);

const isHidden = (row: ReviewVO) => String(row.displayStatus || '').toUpperCase() === 'HIDE';

const displayStatusText = (value?: string) => displayStatusOptions.find((item) => item.value === value)?.label || value || '-';

const displayStatusTag = (value?: string): DisplayStatusTagType => displayStatusOptions.find((item) => item.value === value)?.type || 'info';

const adjustedText = (value?: string) => ({ Y: '是', N: '否' })[String(value || '').toUpperCase()] || value || '-';

const formatTime = (value?: string) => proxy?.parseTime(value) || '-';
const userDisplay = (row: ReviewVO) => row.userName || row.nickName || row.userId || '-';
const chefDisplay = (row: ReviewVO) => row.chefName || row.chefId || '-';

onMounted(getList);
</script>

<style scoped>
.review-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
