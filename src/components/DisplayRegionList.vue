<template>
  <div class="display-region-list">
    <div v-if="loading" class="region-tip">加载地区中...</div>
    <div v-else-if="!metadataId" class="region-tip">缺少 metadataId 参数</div>
    <div v-else-if="locations.length === 0" class="region-tip">暂无地区数据</div>
    <!-- TODO: 渲染 locations（Province[]：省份 -> 城市） -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { requestLocations } from '@/api/packages'
import type { Province } from '@/types/region'

interface Props {
  metadataId?: number
}

const props = defineProps<Props>()

const loading = ref(false)
const locations = ref<Province[]>([])

const fetchLocations = async () => {
  if (!props.metadataId) {
    locations.value = []
    return
  }

  loading.value = true
  try {
    const data = await requestLocations({ metadataId: props.metadataId })
    locations.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('获取地区列表失败:', err)
    locations.value = []
  } finally {
    loading.value = false
  }
}

watch(() => props.metadataId, fetchLocations, { immediate: true })
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
