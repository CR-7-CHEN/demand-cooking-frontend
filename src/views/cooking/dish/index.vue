<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="菜品"><el-input v-model="queryParams.dishName" clearable @keyup.enter="getList" /></el-form-item>
        <el-form-item label="菜系"><el-input v-model="queryParams.cuisine" clearable @keyup.enter="getList" /></el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows">
        <el-table-column label="菜品" prop="dishName" min-width="150" />
        <el-table-column label="分类" prop="category" width="130" />
        <el-table-column label="菜系" prop="cuisine" width="130" />
        <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag>{{ row.status === '0' ? '启用' : '停用' }}</el-tag></template></el-table-column>
        <el-table-column label="排序" prop="sort" width="90" />
        <el-table-column label="说明" prop="description" min-width="220" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button link type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="560px" append-to-body>
      <el-form :model="form" label-width="90px">
        <el-form-item label="菜品名"><el-input v-model="form.dishName" /></el-form-item>
        <el-form-item label="分类"><el-input v-model="form.category" /></el-form-item>
        <el-form-item label="菜系"><el-input v-model="form.cuisine" /></el-form-item>
        <el-form-item label="图片"><el-input v-model="form.imageUrl" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio value="0">启用</el-radio><el-radio value="1">停用</el-radio></el-radio-group></el-form-item>
        <el-form-item label="说明"><el-input v-model="form.description" type="textarea" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialog.visible = false">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingDish" lang="ts">
import { addDish, delDish, listDish, updateDish } from '@/api/cooking/dish';
import type { DishVO } from '@/api/cooking/dish/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const loading = ref(false);
const rows = ref<DishVO[]>([]);
const total = ref(0);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, dishName: '', cuisine: '' });
const form = reactive<any>({});
const dialog = reactive({ visible: false, title: '' });

const getList = async () => {
  loading.value = true;
  const res: any = await listDish(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};
const resetQuery = () => { Object.assign(queryParams, { pageNum: 1, dishName: '', cuisine: '' }); getList(); };
const handleAdd = () => { Object.keys(form).forEach((key) => delete form[key]); form.status = '0'; dialog.title = '新增菜品'; dialog.visible = true; };
const handleEdit = (row: DishVO) => { Object.assign(form, row); dialog.title = '编辑菜品'; dialog.visible = true; };
const submit = async () => { form.dishId ? await updateDish(form) : await addDish(form); proxy?.$modal.msgSuccess('保存成功'); dialog.visible = false; getList(); };
const handleDelete = async (row: DishVO) => { if (!row.dishId) return; await delDish(row.dishId); proxy?.$modal.msgSuccess('删除成功'); getList(); };
onMounted(getList);
</script>
