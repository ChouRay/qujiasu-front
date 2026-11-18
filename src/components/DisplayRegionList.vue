<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    destroy-on-close
  >
    <div class="display-region-list">
      <div v-if="loading" class="region-tip">加载地区中...</div>
      <div v-else-if="!categoryId" class="region-tip">缺少 categoryId 参数</div>
      <div v-else-if="metadataArr.length === 0" class="region-tip">暂无地区数据</div>

      <template v-else>
        <!-- 顶部提示 -->
        <div class="region-hint">
          高级别套餐可选择低级别套餐中的地区，不选择则默认在当前套餐下随机获取
        </div>

        <!-- 套餐分组 -->
        <div
          v-for="metadata in metadataArr"
          :key="metadata.metadataId"
          class="package-group"
        >
          <div class="package-title">套餐：{{ metadata.metadataName }}</div>

          <div
            v-for="province in metadata.locations"
            :key="province.id"
            class="province-group"
          >
            <div class="province-title">省份：{{ province.pname }}</div>
            <div class="city-list">
              <span
                v-for="city in province.cities"
                :key="city.id"
                class="city-item"
              >
                {{ city.cname }}（余量：{{ city.lineNum }}）
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { requestLocationsByCategory } from '@/api/packages'
import { isMobile } from '@/utils/util'
import type { PackageMetadata } from '@/types/region'

interface Props {
  modelValue: boolean
  categoryId?: number
  catalogName?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  categoryId: undefined,
  catalogName: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const dialogTitle = computed(() => `查看${props.catalogName || ''}地区`)

const dialogWidth = ref(isMobile(navigator.userAgent) ? '90%' : 600)

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
    metadataArr.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('获取地区列表失败:', err)
    metadataArr.value = []
  } finally {
    loading.value = false
  }
}

// 打开弹窗或 categoryId 变化时加载地区
watch(
  [() => props.modelValue, () => props.categoryId],
  ([visible]) => {
    if (visible) {
      fetchRegionGroup()
    }
  }
)
</script>

<style scoped>
.display-region-list {
  padding: 10px 0;
  max-height: 60vh;
  overflow-y: auto;
}

.region-tip {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

/* 顶部提示 */
.region-hint {
  padding: 10px 14px;
  margin-bottom: 16px;
  background: #ecf5ff;
  border-radius: 8px;
  color: #409eff;
  font-size: 13px;
  line-height: 1.5;
}

/* 套餐分组 */
.package-group {
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.package-group:last-child {
  margin-bottom: 0;
}

.package-title {
  padding: 10px 14px;
  background: #f5f7fa;
  font-size: 15px;
  font-weight: bold;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
}

.province-group {
  padding: 10px 14px;
  border-bottom: 1px dashed #eee;
}

.province-group:last-child {
  border-bottom: none;
}

.province-title {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
  margin-bottom: 8px;
}

.city-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.city-item {
  padding: 4px 10px;
  background: #fafbfc;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  font-size: 13px;
  color: #606266;
}
</style>
