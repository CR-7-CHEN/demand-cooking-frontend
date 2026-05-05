<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="联系人">
          <el-input v-model="queryParams.contactName" clearable placeholder="联系人姓名" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryParams.contactPhone" clearable placeholder="收货手机号" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="queryParams.userKeyword" clearable placeholder="用户" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="所在区域">
          <el-input v-model="queryParams.areaName" clearable placeholder="省市区/服务区域" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="创建时间" style="width: 308px">
          <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows" style="width: 100%">
        <el-table-column label="用户" min-width="130" show-overflow-tooltip>
          <template #default="{ row }">{{ userDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="联系人" prop="contactName" min-width="120" />
        <el-table-column label="手机号" prop="contactPhone" min-width="130" />
        <el-table-column label="所在区域" prop="areaName" min-width="160" show-overflow-tooltip />
        <el-table-column label="详细地址" prop="detailAddress" min-width="220" show-overflow-tooltip />
        <el-table-column label="门牌号" prop="houseNumber" min-width="120" show-overflow-tooltip />
        <el-table-column label="默认地址" prop="defaultFlag" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.defaultFlag === 'Y' ? 'success' : 'info'">{{ defaultFlagText(row.defaultFlag) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态/类型" prop="snapshotType" min-width="120">
          <template #default="{ row }">{{ snapshotTypeText(row.snapshotType) }}</template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="170" />
        <el-table-column label="操作" fixed="right" width="210">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="720px" append-to-body>
      <el-form :model="form" label-width="100px" :disabled="isView">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="用户">
              <el-input v-model="form.userId" placeholder="用户" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="form.contactName" placeholder="联系人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="form.contactPhone" placeholder="联系人手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认地址">
              <el-radio-group v-model="form.defaultFlag">
                <el-radio value="Y">是</el-radio>
                <el-radio value="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域编码">
              <el-input v-model="form.areaCode" placeholder="区域编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在区域">
              <el-input v-model="form.areaName" placeholder="省市区/服务区域" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详细地址">
              <el-input v-model="form.detailAddress" type="textarea" placeholder="街道、小区、楼栋等详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门牌号">
              <el-input v-model="form.houseNumber" placeholder="门牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态/类型">
              <el-input v-model="form.snapshotType" placeholder="常用地址可留空" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度">
              <el-input v-model="form.longitude" placeholder="经度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input v-model="form.latitude" placeholder="纬度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源地址">
              <el-input v-model="form.sourceAddressId" placeholder="来源地址ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快照时间">
              <el-date-picker v-model="form.snapshotTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="快照时间" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">{{ isView ? '关闭' : '取消' }}</el-button>
        <el-button v-if="!isView" type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingAddress" lang="ts">
import { addAddress, delAddress, getAddress, listAddress, updateAddress } from '@/api/cooking/address';
import type { AddressVO } from '@/api/cooking/address/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const loading = ref(false);
const rows = ref<AddressVO[]>([]);
const total = ref(0);
const dateRange = ref<string[]>([]);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, contactName: '', contactPhone: '', userKeyword: '', areaName: '' });
const form = reactive<any>({});
const dialog = reactive({ visible: false, title: '', mode: 'edit' });
const isView = computed(() => dialog.mode === 'view');

const defaultFlagText = (value?: string) => ({ Y: '是', N: '否', '1': '是', '0': '否' })[value || ''] || value || '否';
const snapshotTypeText = (value?: string) => ({ USER: '常用地址', ORDER: '订单快照', RESERVE: '预约快照' })[value || ''] || value || '常用地址';
const userDisplay = (row: AddressVO) => row.userName || row.nickName || row.userId || '-';

const getList = async () => {
  loading.value = true;
  try {
    const res: any = await listAddress(proxy?.addDateRange(queryParams, dateRange.value));
    rows.value = res.rows || res.data || [];
    total.value = res.total || rows.value.length;
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.keys(form).forEach((key) => delete form[key]);
  form.defaultFlag = 'N';
};

const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  Object.assign(queryParams, { pageNum: 1, contactName: '', contactPhone: '', userKeyword: '', areaName: '' });
  dateRange.value = [];
  getList();
};

const openDialog = async (row: AddressVO, mode: 'view' | 'edit') => {
  resetForm();
  if (row.addressId) {
    const res: any = await getAddress(row.addressId);
    Object.assign(form, res.data || row);
  } else {
    Object.assign(form, row);
  }
  dialog.mode = mode;
  dialog.title = mode === 'view' ? '查看地址' : '编辑地址';
  dialog.visible = true;
};

const handleAdd = () => {
  resetForm();
  dialog.mode = 'add';
  dialog.title = '新增地址';
  dialog.visible = true;
};

const handleView = (row: AddressVO) => openDialog(row, 'view');
const handleEdit = (row: AddressVO) => openDialog(row, 'edit');

const submit = async () => {
  form.addressId ? await updateAddress(form) : await addAddress(form);
  proxy?.$modal.msgSuccess('保存成功');
  dialog.visible = false;
  getList();
};

const handleDelete = async (row: AddressVO) => {
  if (!row.addressId) return;
  await delAddress(row.addressId);
  proxy?.$modal.msgSuccess('删除成功');
  getList();
};

onMounted(getList);
</script>
