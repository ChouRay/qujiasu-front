<template>
  <div class="withdrawals-page">
    <div class="table-container">
      <el-table 
        v-loading="loading" 
        :data="tableData" 
        style="width: 100%"
        :default-sort="{prop: 'gmtApply', order: 'descending'}"
      >
        <el-table-column type="index" label="编号" width="60" align="center" />
        
        <el-table-column prop="totalAmount" label="提现总金额" min-width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ Number(row.totalAmount).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="destination" label="提现到" min-width="150">
          <template #default="{ row }">
            {{ formatWithdrawDestination(row.destination) }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ formatWithdrawalStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="gmtApply" label="申请时间" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.gmtApply) }}
          </template>
        </el-table-column>

        <el-table-column prop="gmtComplete" label="完成时间" min-width="160">
          <template #default="{ row }">
            {{ row.gmtComplete ? formatDateTime(row.gmtComplete) : '-' }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 移动端卡片视图 -->
      <div class="mobile-list" v-if="isMobile">
        <div v-loading="loading" class="list-wrapper">
          <div v-for="(item, index) in tableData" :key="item.id || index" class="mobile-card">
            <div class="card-header">
              <span class="card-label">编号：{{ index + 1 }}</span>
              <el-tag :type="getStatusType(item.status)" size="small">
                {{ formatWithdrawalStatus(item.status) }}
              </el-tag>
            </div>
            <div class="card-row">
              <span class="card-label">金额：</span>
              <span class="card-value amount-text">¥{{ Number(item.totalAmount).toFixed(2) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">提现到：</span>
              <span class="card-value">{{ formatWithdrawDestination(item.destination) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">申请时间：</span>
              <span class="card-value">{{ formatDateTime(item.gmtApply) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">完成时间：</span>
              <span class="card-value">{{ item.gmtComplete ? formatDateTime(item.gmtComplete) : '-' }}</span>
            </div>
          </div>
          <div v-if="!loading && tableData.length === 0" class="empty-data">暂无提现记录</div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getWithdrawalRecords } from '@/api/agent';
import { formatWithdrawDestination, formatWithdrawalStatus } from '@/utils/apiEnums';
import { formatDateTime } from '@/utils/times';

// 状态
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 检测移动端
const isMobile = computed(() => window.innerWidth < 768);

// 获取数据
const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getWithdrawalRecords({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    });
    
    // 适配返回数据结构，根据实际情况调整
    if (res) {
      tableData.value = res.data || [];
      total.value = res.totalNum || 0;
    } else {
      tableData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('获取提现记录失败:', error);
    tableData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
  fetchData();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchData();
};

// 状态标签颜色
const getStatusType = (status: string | number) => {
  const s = String(status);
  if (s === 'SUCCESS' || s === 'COMPLETED' || s === '1') return 'success';
  if (s === 'PENDING' || s === 'PROCESSING' || s === '0') return 'warning';
  if (s === 'FAILED' || s === 'REJECTED') return 'danger';
  return 'info';
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.withdrawals-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.amount-text {
  font-weight: bold;
  color: #f56c6c;
  font-family: DIN, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  padding: 15px 20px;
  border-radius: 8px;
}

/* 移动端样式 */
.mobile-list {
  display: none;
}

@media (max-width: 768px) {
  .el-table {
    display: none;
  }
  
  .mobile-list {
    display: block;
  }

  .list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .mobile-card {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 5px;
  }

  .card-label {
    font-size: 13px;
    color: #909399;
    font-weight: 500;
  }

  .card-value {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }

  .card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination-container {
    justify-content: center;
    background: transparent;
    padding: 10px 0;
  }
  
  .table-container {
    background: transparent;
    padding: 0;
    box-shadow: none;
  }
}
</style>
