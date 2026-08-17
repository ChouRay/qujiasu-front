<template>
  <div class="commissions-page">
    <!-- 内容区域 -->
    <el-row :gutter="16" class="content-row">
      <el-col :span="24">
        <el-card shadow="never" class="data-card">
          
          <!-- 桌面端：表格视图 -->
          <div class="desktop-view">
            <div class="table-wrapper">
              <el-table 
                :data="tableData" 
                v-loading="loading" 
                style="width: 100%"
                :default-sort="{prop: 'gmtCreate', order: 'descending'}"
              >
                <el-table-column type="index" label="编号" width="60" />
                
                <el-table-column prop="buyerUserName" label="下单会员" min-width="120" show-overflow-tooltip />
                
                <el-table-column prop="dividendRatio" label="分红比例" min-width="80">
                  <template #default="{ row }">
                    {{ (row.dividendRatio * 100).toFixed(2) }}%
                  </template>
                </el-table-column>
                
                <el-table-column prop="status" label="分红状态" min-width="100">
                  <template #default="{ row }">
                    <span v-html="formatDividendStatus(row.status as DividendStatus)"></span>
                  </template>
                </el-table-column>
                
                <el-table-column prop="finalObtainAmount" label="获得佣金" min-width="100">
                  <template #default="{ row }">
                    <span class="text-success">¥{{ row.finalObtainAmount.toFixed(2) }}</span>
                  </template>
                </el-table-column>
                
                <el-table-column prop="finalObtainPoint" label="获得积分" min-width="100">
                  <template #default="{ row }">
                    {{ row.finalObtainPoint }}
                  </template>
                </el-table-column>
                
                <el-table-column prop="orderType" label="来源" min-width="100">
                  <template #default="{ row }">
                    {{ formatDividendSource(row.orderType as DividendSource) }}
                  </template>
                </el-table-column>
                
                <el-table-column prop="tradeNo" label="订单编号" min-width="150" show-overflow-tooltip />
                
                <el-table-column label="创建时间" min-width="160">
                  <template #default="{ row }">
                    {{ formatDateTime(row.gmtCreate) }}
                  </template>
                </el-table-column>
                
                <el-table-column label="完成时间" min-width="160">
                  <template #default="{ row }">
                    {{ row.gmtComplete ? formatDateTime(row.gmtComplete) : '-' }}
                  </template>
                </el-table-column>
                
              </el-table>
            </div>
          </div>

          <!-- 移动端：卡片视图 -->
          <div class="mobile-view">
            <div v-loading="loading" class="mobile-list">
              <div v-for="(item, index) in tableData" :key="item.id" class="mobile-card-item">
                <div class="card-header">
                  <span class="card-index">#{{ index + 1 }}</span>
                  <span class="label">状态:</span>
                  <span v-html="formatDividendStatus(item.status as DividendStatus)" class="card-status"></span>
                  <span class="card-source">{{ formatDividendSource(item.orderType as DividendSource) }}</span>
                </div>
                
                <div class="card-body">
                  <div class="info-row">
                    <span class="label">会员:</span>
                    <span class="value">{{ item.buyerUserName }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">佣金:</span>
                    <span class="value text-success">¥{{ item.finalObtainAmount.toFixed(2) }}</span>
                    <span class="label ml-2">积分:</span>
                    <span class="value">{{ item.finalObtainPoint }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">比例:</span>
                    <span class="value">{{ (item.dividendRatio * 100).toFixed(2) }}%</span>
                    <span class="label ml-2">订单:</span>
                    <span class="value font-mono">{{ item.tradeNo }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">创建:</span>
                    <span class="value text-secondary">{{ formatDateTime(item.gmtCreate) }}</span>
                  </div>
                  <div class="info-row" v-if="item.gmtComplete">
                    <span class="label">完成:</span>
                    <span class="value text-secondary">{{ formatDateTime(item.gmtComplete) }}</span>
                  </div>
                </div>
              </div>
              
              <el-empty v-if="tableData.length === 0 && !loading" description="暂无佣金记录" />
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
              background
            />
          </div>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCommissionRecords } from '@/api/agent'
import { formatDateTime } from '@/utils/times'
import { formatDividendStatus, formatDividendSource, type DividendStatus, type DividendSource } from '@/utils/apiEnums'
import type { PortalDividendRecordVO, CommissionRecordsResponse } from '@/types/agent'

// 数据定义
const tableData = ref<PortalDividendRecordVO[]>([])
const loading = ref(false)

// 分页参数
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 获取数据方法
const fetchData = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: pagination.value.currentPage,
      pageSize: pagination.value.pageSize
    }
    
    const res: CommissionRecordsResponse = await getCommissionRecords(params)
    
    tableData.value = res.data || []
    pagination.value.total = res.totalNum || 0
  } catch (error) {
    console.error('获取佣金记录失败:', error)
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 分页事件
const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val
  pagination.value.currentPage = 1
  fetchData()
}

const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.commissions-page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content-row {
  width: 100%;
}

.data-card {
  border-radius: 8px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

/* 桌面端表格样式 */
.desktop-view {
  display: block;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 16px;
}

:deep(.el-table) {
  width: 100%;
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 12px 0;
}

.text-success { color: #67C23A; font-weight: 600; }
.text-secondary { color: #909399; font-size: 12px; }
.text-gray { color: #909399; }

.font-mono {
  font-family: monospace;
  background: #f5f7fa;
  padding: 0 4px;
  border-radius: 2px;
}

.ml-2 {
  margin-left: 8px;
}

/* 移动端卡片样式 */
.mobile-view {
  display: none;
}

.mobile-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-card-item {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.mobile-card-item:active {
  background-color: #f9fafc;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.card-index {
  font-size: 12px;
  color: #909399;
  font-weight: bold;
}

.card-source {
  font-size: 14px;
  font-weight: 600;
  color: #409EFF;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.card-status {
  font-size: 13px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
}

.label {
  width: 50px;
  color: #909399;
  flex-shrink: 0;
}

.value {
  color: #303133;
  word-break: break-all;
  flex: 1;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

/* 响应式断点：小于 768px 切换为卡片视图 */
@media screen and (max-width: 768px) {
  .commissions-page {
    padding: 10px;
  }
  
  .desktop-view {
    display: none;
  }
  
  .mobile-view {
    display: block;
  }
  
  .pagination-container {
    justify-content: center;
  }
  
  :deep(.el-pagination) {
    --el-pagination-font-size: 12px;
  }
}
</style>
