<template>
  <div class="invited-users">
    <!-- 顶部筛选 -->
    <div class="filter-section">
      <el-button
        :type="activeTab === 0 ? 'primary' : 'default'"
        @click="changeTab(0)"
      >
        普通会员
      </el-button>
      <el-button
        :type="activeTab === 1 ? 'primary' : 'default'"
        @click="changeTab(1)"
      >
        代理商会员
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="index" label="编号" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="phoneNumber" label="手机号">
        <template #default="{ row }">
          {{ formatPhone(row.phoneNumber) }}
        </template>
      </el-table-column>
      <el-table-column prop="agentLevel" label="代理等级" />
      <el-table-column label="来源">
        <template #default="{ row }">
          {{ row.inviteSource === 1 ? '推广码' : '其他' }}
        </template>
      </el-table-column>
      <el-table-column prop="totalCost" label="已消费" />
      <el-table-column prop="agentUserCount" label="下级代理商" />
      <el-table-column prop="normalUserCount" label="下级普通会员" />
      <el-table-column label="加入时间">
        <template #default="{ row }">
          {{ formatDateTime(row.gmtCreate) }}
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @size-change="fetchData"
      @current-change="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getInvitedUserRecords } from '@/api/agents'
import { formatDateTime } from '@/utils/times'

const activeTab = ref<number>(0) // 0: 普通会员, 1: 代理商会员
const tableData = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 格式化手机号
const formatPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{6}(\d{3})/, '$1****$2')
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      isAgent: activeTab.value,
      page: currentPage.value,
      size: pageSize.value
    }
    const res = await getInvitedUserRecords(params)
    tableData.value = res.data.records.map((item: any, index: number) => ({
      ...item,
      index: (currentPage.value - 1) * pageSize.value + index + 1
    }))
    total.value = res.data.total
  } catch (error) {
    console.error('获取邀请用户记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换标签页
const changeTab = (tab: number) => {
  activeTab.value = tab
  currentPage.value = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.filter-section {
  margin-bottom: 20px;
}
</style>
