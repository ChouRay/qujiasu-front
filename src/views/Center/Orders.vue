<template>
  <div class="orders-page">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" class="search-form">
        <el-form-item label="账号查询">
          <el-input 
            v-model="searchUsername" 
            placeholder="请输入用户名" 
            clearable
            @keyup.enter="handleSearch"
            style="width: 200px;"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

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
                :default-sort="{prop: 'gmt_create', order: 'descending'}"
              >
                <el-table-column type="index" label="编号" width="60" />
                
                <el-table-column prop="username" label="账号" min-width="120" show-overflow-tooltip />
                <el-table-column prop="password" label="密码" min-width="100" show-overflow-tooltip />
                
                <el-table-column label="用量" min-width="100">
                  <template #default="{ row }">
                    <span :class="{ 'text-success': row.usingCount > 0 }">
                      {{ row.usingCount }} / {{ row.usageCount }}
                    </span>
                  </template>
                </el-table-column>
                
                <el-table-column prop="name" label="版本" min-width="100" />
                
                <el-table-column label="绑定项目" min-width="120">
                  <template #default="{ row }">
                    <el-button 
                      v-if="row.config && row.config.gameInfo" 
                      type="primary" 
                      size="small"
                      plain
                    >
                      {{ row.config.gameInfo.name }}
                    </el-button>
                    <span v-else class="text-gray">未绑定</span>
                  </template>
                </el-table-column>
                
                <el-table-column label="开户时间" min-width="160">
                  <template #default="{ row }">
                    {{ formatDateTime(row.gmt_create) }}
                  </template>
                </el-table-column>
                
                <el-table-column label="到期时间" min-width="160">
                  <template #default="{ row }">
                    <span :style="{ color: getDeadlineColor(row.dateOffline) }">
                      {{ formatDateTime(row.dateOffline) }}
                    </span>
                  </template>
                </el-table-column>
                
                <el-table-column label="操作" fixed="right" width="150">
                  <template #default>
                    <div class="action-buttons">
                      <el-button type="primary" size="small">续费</el-button>
                      <el-button type="success" size="small">增减</el-button>
                    </div>
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
                  <span class="label">到期:</span>
                  <span class="value" :style="{ color: getDeadlineColor(item.dateOffline) }">
                    {{ formatDateTime(item.dateOffline) }}
                  </span>
                  <span class="card-version">{{ item.name }}</span>
                </div>
                
                <div class="card-body">
                  <div class="info-row">
                    <span class="label">账号:</span>
                    <span class="value font-mono">{{ item.username }}</span>
                    <span class="label">密码:</span>
                    <span class="value font-mono">{{ item.password }}</span>
                  </div>                 
                  <div class="info-row">
                    <span class="label">项目:</span>
                    <span class="value">
                      <el-tag 
                        v-if="item.config && item.config.gameInfo" 
                        size="small" 
                        type="primary"
                      >
                        {{ item.config.gameInfo.name }}
                      </el-tag>
                      <span v-else class="text-gray">未绑定</span>
                    </span>
                  </div>                 
                  <div class="info-row">
                    <span class="label">用量:</span>
                    <span :class="['value', { 'text-success': item.usingCount > 0 }]">
                      {{ item.usingCount }} / {{ item.usageCount }}
                    </span>

                    <div class="">
                      <el-button type="primary" size="small" class="action-btn">续费</el-button>
                      <el-button type="success" size="small" class="action-btn">增减</el-button>
                    </div>
                  </div> 
                </div>
              </div>
              
              <el-empty v-if="tableData.length === 0 && !loading" description="暂无订单数据" />
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
import { getPackagesList, getPackagesByUsername } from '@/api/packages'
import { formatDateTime } from '@/utils/times'
import { Search } from '@element-plus/icons-vue'
import type { SubscriptionVO, PackagesResponse } from '@/types/packages'

// 数据定义
const tableData = ref<SubscriptionVO[]>([])
const loading = ref(false)
const searchUsername = ref('')
const isSearchMode = ref(false)

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
    
    let res: PackagesResponse
    if (isSearchMode.value && searchUsername.value) {
      // 注意：这里假设后端搜索接口也支持分页，如果不支持需调整逻辑
      const searchRes = await getPackagesByUsername(searchUsername.value, params)
      res = searchRes
    } else {
      const listRes = await getPackagesList(params)
      res = listRes
    }
    
    tableData.value = res.data || []
    pagination.value.total = res.totalNum || 0
  } catch (error) {
    console.error('获取套餐列表失败:', error)
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 搜索与重置
const handleSearch = () => {
  isSearchMode.value = true
  pagination.value.currentPage = 1
  fetchData()
}

const handleReset = () => {
  searchUsername.value = ''
  isSearchMode.value = false
  pagination.value.currentPage = 1
  fetchData()
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

// 到期时间颜色逻辑
const getDeadlineColor = (dateStr: string) => {
  if (!dateStr) return '#303133'
  
  const now = new Date().getTime()
  const target = new Date(dateStr).getTime()
  const diff = target - now
  
  const oneDay = 24 * 60 * 60 * 1000
  const twelveHours = 12 * 60 * 60 * 1000
  
  if (diff < 0) {
    return '#909399' // 灰色：已过期
  } else if (diff < twelveHours) {
    return '#F56C6C' // 红色：< 12小时
  } else if (diff < 3 * oneDay) {
    return '#E6A23C' // 黄色：< 3天
  } else {
    return '#67C23A' // 绿色：> 3天
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.orders-page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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

.action-buttons {
  display: flex;
  gap: 8px;
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

.card-version {
  font-size: 14px;
  font-weight: 600;
  color: #409EFF;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
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

.font-mono {
  font-family: monospace;
  background: #f5f7fa;
  padding: 0 4px;
  border-radius: 2px;
}

.text-success { color: #67C23A; font-weight: 600; }
.text-gray { color: #909399; }
.text-secondary { color: #909399; font-size: 12px; }

.card-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.action-btn {
  flex: 1;
  max-width: 100px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

/* 响应式断点：小于 768px 切换为卡片视图 */
@media screen and (max-width: 768px) {
  .orders-page {
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