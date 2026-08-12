<template>
  <div class="orders-page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
        </div>
      </template>
      
      <el-table :data="orderList" style="width: 100%" v-loading="loading">
        <el-table-column prop="orderNo" label="订单编号" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-wrapper" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const orderList = ref<any[]>([
  // 示例数据，实际应从 API 获取
  {
    orderNo: 'ORD202501010001',
    productName: '趣加速月卡套餐',
    amount: 39.9,
    status: 1,
    createTime: '2025-01-01 10:30:00'
  },
  {
    orderNo: 'ORD202501020002',
    productName: '趣加速季卡套餐',
    amount: 99.9,
    status: 2,
    createTime: '2025-01-02 14:20:00'
  },
  {
    orderNo: 'ORD202501030003',
    productName: '趣加速年卡套餐',
    amount: 369.9,
    status: 3,
    createTime: '2025-01-03 09:15:00'
  }
])

const getStatusType = (status: number) => {
  const typeMap: Record<number, any> = {
    1: 'warning',    // 待支付
    2: 'success',    // 已完成
    3: 'info',       // 已取消
    4: 'danger'      // 已退款
  }
  return typeMap[status] || ''
}

const getStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    1: '待支付',
    2: '已完成',
    3: '已取消',
    4: '已退款'
  }
  return textMap[status] || '未知'
}

const viewDetail = (row: any) => {
  ElMessage.info(`查看订单详情：${row.orderNo}`)
  // TODO: 跳转到订单详情页或打开弹窗
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadOrderList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadOrderList()
}

const loadOrderList = async () => {
  loading.value = true
  try {
    // TODO: 调用 API 获取订单列表
    // const res = await orderApi.getList({ page: currentPage.value, size: pageSize.value })
    // orderList.value = res.data.list
    // total.value = res.data.total
  } catch (error) {
    ElMessage.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrderList()
})
</script>

<style scoped lang="scss">
.orders-page {
  .box-card {
    border-radius: 12px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 16px;
    }
  }
  
  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
