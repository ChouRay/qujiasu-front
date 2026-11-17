<template>
  <div class="display-region-list">
    <div v-if="loading" class="region-tip">加载地区中...</div>
    <div v-else-if="!categoryId" class="region-tip">缺少 categoryId 参数</div>
    <div v-else-if="metadataArr.length === 0" class="region-tip">暂无地区数据</div>
    <!-- TODO: 渲染 locations（Province[]：省份 -> 城市） -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { requestLocationsByCategory } from '@/api/packages'
import type { PackageMetadata } from '@/types/region'

interface Props {
  categoryId?: number
}

const props = defineProps<Props>()

const loading = ref(false)
const metadataArr = ref<PackageMetadata[]>([])

const fetchRegionGroup = async () => {
  if (!props.categoryId) {
    metadataArr.value = []
    return
  }

  loading.value = true
  try {
    const data = await requestLocationsByCategory({ categoryId: props.categoryId })
    metadataArr.value =  Array.isArray(data) ? data : []    
  } catch (err) {
    console.error('获取地区列表失败:', err)
    metadataArr.value = []
  } finally {
    loading.value = false
  }
}

watch(() => props.categoryId, fetchRegionGroup, { immediate: true })
</script>

<style scoped>
.display-region-list {
  padding: 20px;
}

.region-tip {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}
</style>
