<template>
  <div class="order-page">
    <el-card>
      <!-- 搜索区域 -->
      <div class="search-box" style="margin-bottom: 20px; display: flex; gap: 10px;">
        <el-input
          v-model="searchUsername"
          placeholder="请输入套餐账号 username"
          style="width: 300px;"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch" :loading="loading">
          查询
        </el-button>
        <el-button @click="resetSearch">
          重置
        </el-button>
      </div>

      <el-table 
        :data="tableData" 
        v-loading="loading" 
        style="width: 100%"
        :row-class-name="getRowClass"
      >
        <el-table-column type="index" label="自动编号" width="80" />

        <el-table-column prop="username" label="套餐账号" min-width="120" />

        <el-table-column prop="password" label="密码" min-width="100" />

        <el-table-column label="用量" min-width="100">
          <template #default="{ row }">
            <span :style="{ color: getUsageColor(row), fontWeight: row.usingCount > 0 ? 'bold' : 'normal' }">
              {{ formatUsage(row) }}
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
            <el-tag v-else size="small" type="info">未绑定</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="开户时间" min-width="140">
          <template #default="{ row }">
            {{ formatDateTime(row.gmt_create) }}
          </template>
        </el-table-column>

        <el-table-column label="到期时间" min-width="140">
          <template #default="{ row }">
            <span :style="{ color: getDeadlineColor(row) }">
              {{ formatDateTime(row.dateOffline) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" fixed="right">
          <template #default>
            <el-button type="primary" size="small">续费</el-button>
            <el-button type="success" size="small">增减</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.totalNum"
        style="margin-top: 20px; text-align: right"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPackagesList, getPackagesByUsername } from '@/api/packages'
import { formatDateTime } from '@/utils/times'
import type { PackagesResponse, SubscriptionVO } from '@/types/packages'
import { Search } from '@element-plus/icons-vue'

// 数据定义
const tableData = ref<SubscriptionVO[]>([])
const loading = ref(false)
const searchUsername = ref('')
const isSearchMode = ref(false)

// 分页参数
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  totalNum: 0
})

// 获取数据方法
const fetchData = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize
    }

    let res: PackagesResponse
    if (isSearchMode.value && searchUsername.value) {
      // 搜索模式：按用户名查询
      res = await getPackagesByUsername(searchUsername.value, params)
    } else {
      // 普通模式：获取全部列表
      res = await getPackagesList(params)
    }
    
    tableData.value = res.data || []
    pagination.value.totalNum = res.totalNum || 0
  } catch (error) {
    console.error('获取套餐列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索功能
const handleSearch = () => {
  isSearchMode.value = true
  pagination.value.pageNum = 1
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  searchUsername.value = ''
  isSearchMode.value = false
  pagination.value.pageNum = 1
  fetchData()
}

// 格式化用量显示
const formatUsage = (row: SubscriptionVO) => {
  return `${row.usingCount}/${row.usageCount}`
}

// 用量颜色逻辑
const getUsageColor = (row: SubscriptionVO) => {
  return row.usingCount > 0 ? '#67C23A' : '' // 绿色
}

// 检查到期时间状态
const getDeadlineStatus = (dateStr: string) => {
  if (!dateStr) return 'normal'
  
  const now = new Date().getTime()
  const deadline = new Date(dateStr).getTime()
  const diff = deadline - now
  
  const hours12 = 12 * 60 * 60 * 1000
  const days3 = 3 * 24 * 60 * 60 * 1000
  
  if (diff <= 0) return 'expired'       // 已过期
  if (diff <= hours12) return 'urgent'  // 12小时内
  if (diff <= days3) return 'warning'   // 3天内
  
  return 'normal'
}

// 到期时间文字颜色
const getDeadlineColor = (row: SubscriptionVO) => {
  const status = getDeadlineStatus(row.dateOffline)
  if (status === 'urgent') return '#F56C6C' // 红色
  if (status === 'warning') return '#E6A23C' // 黄色
  if (status === 'normal') return '#67C23A' // 绿色（超过3天）
  return ''
}

// 行样式类名
const getRowClass = ({ row }: { row: SubscriptionVO }) => {
  const status = getDeadlineStatus(row.dateOffline)
  return status === 'expired' ? 'expired-row' : ''
}

// 分页事件
const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val
  pagination.value.pageNum = 1
  fetchData()
}

const handleCurrentChange = (val: number) => {
  pagination.value.pageNum = val
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.order-page {
  padding: 20px;
}

/* 过期行样式 */
:deep(.expired-row) {
  background-color: #f5f7fa !important;
  color: #909399;
}

/* 强制覆盖过期行的文字颜色，使其更灰暗 */
:deep(.expired-row .cell) {
  color: #909399;
}

/* 操作按钮在过期行中置灰 */
:deep(.expired-row .el-button) {
  filter: grayscale(100%);
  opacity: 0.6;
}
</style>
