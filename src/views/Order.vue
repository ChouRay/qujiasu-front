<template>
  <div class="order-page">
    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="自动编号" width="80" />
        
        <el-table-column prop="username" label="套餐账号" width="150" />
        
        <el-table-column prop="password" label="密码" width="120" />
        
        <el-table-column label="用量" width="120">
          <template #default="{ row }">
            {{ row.usingCount }}/{{ row.usageCount }}
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="版本" width="120" />
        
        <el-table-column label="绑定项目" width="180">
          <template #default="{ row }">
            <el-button 
              v-if="row.config && row.config.gameInfo" 
              type="primary" 
              size="small"
            >
              {{ row.config.gameInfo.name }}
            </el-button>
            <el-button v-else type="info" size="small" disabled>
              未绑定
            </el-button>
          </template>
        </el-table-column>
        
        <el-table-column label="开户时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.gmt_create) }}
          </template>
        </el-table-column>
        
        <el-table-column label="到期时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.dateOffline) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
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
import { getPackagesList } from '@/api/packages'
import { formatDateTime } from '@/utils/times'
import type { PackagesResponse, SubscriptionVO } from '@/types/packages'

// 数据定义
const tableData = ref<SubscriptionVO[]>([])
const loading = ref(false)

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
    
    const res: PackagesResponse = await getPackagesList(params)
    tableData.value = res.data || []
    pagination.value.totalNum = res.totalNum || 0
  } catch (error) {
    console.error('获取套餐列表失败:', error)
  } finally {
    loading.value = false
  }
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
</style>
