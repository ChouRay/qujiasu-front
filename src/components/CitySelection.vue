<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择地区"
    :width="dialogWidth"
    destroy-on-close
  >
    <div class="city-selection">
      <div v-if="loading" class="region-tip">加载地区中...</div>
      <div v-else-if="!categoryId || !metadataId" class="region-tip">缺少参数</div>
      <div v-else-if="allPackages.length === 0" class="region-tip">暂无地区数据</div>

      <template v-else>
        <!-- 已选地区 -->
        <div class="selected-region">
          <span class="selected-region-label">已选地区：</span>
          <span v-if="selectedCities.length === 0" class="selected-region-empty">暂未选择</span>
          <template v-else>
            <span v-for="city in selectedCities" :key="city.id" class="selected-city-tag">
              {{ city.cname }}
            </span>
          </template>
        </div>

        <!-- 顶部提示 -->
        <div class="region-hint">
          高级别套餐可选择低级别套餐中的地区，不选择则默认在当前套餐下随机获取
        </div>

        <!-- 套餐分组 -->
        <div
          v-for="(metadata, index) in allPackages"
          :key="metadata.metadataId"
          class="package-group"
          :class="{ disabled: index > currentIndex }"
        >
          <div class="package-title">
            套餐：{{ metadata.metadataName }}
            <span v-if="metadata.metadataId === metadataId" class="current-tag">当前</span>
          </div>

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
                :class="{
                  active: isSelected(city.id),
                  disabled: index > currentIndex
                }"
                @click="toggleCity(city, index)"
              >
                {{ city.cname }}（余量：{{ city.lineNum }}）
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <button @click="dialogVisible = false" class="cancel-btn">取消</button>
        <button @click="handleConfirm" class="confirm-btn">确认</button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { requestLocationsByCategory, requestLocations } from '@/api/packages'
import { isMobile } from '@/utils/util'
import type { PackageMetadata, City } from '@/types/region'

interface Props {
  modelValue: boolean
  categoryId?: number | null
  metadataId?: number | null
  gameId?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', cities: City[]): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const dialogWidth = ref(isMobile(navigator.userAgent) ? '90%' : 640)

const loading = ref(false)
const allPackages = ref<PackageMetadata[]>([])
const currentIndex = ref(-1)
const selectedCities = ref<City[]>([])

const isSelected = (cityId: number) => {
  return selectedCities.value.some(c => c.id === cityId)
}

const toggleCity = (city: City, packageIndex: number) => {
  // 高于当前套餐索引的不可选
  if (packageIndex > currentIndex.value) return

  const idx = selectedCities.value.findIndex(c => c.id === city.id)
  if (idx >= 0) {
    selectedCities.value.splice(idx, 1)
  } else {
    selectedCities.value.push(city)
  }
}

const fetchData = async () => {
  if (!props.categoryId || !props.metadataId) {
    allPackages.value = []
    currentIndex.value = -1
    return
  }

  loading.value = true
  try {
    // 1. 版本所有地区
    const all = await requestLocationsByCategory({ categoryId: props.categoryId })
    allPackages.value = Array.isArray(all) ? all : []

    // 2. 当前套餐地区（按 gameId 过滤）
    if (props.gameId) {
      await requestLocations({ metadataId: props.metadataId, gameId: props.gameId })
      // TODO: 该结果可用于标记当前套餐在实际游戏下的可用城市
    }

    // 3. 当前套餐在版本所有地区中的索引
    currentIndex.value = allPackages.value.findIndex(p => p.metadataId === props.metadataId)
  } catch (err) {
    console.error('获取地区数据失败:', err)
    allPackages.value = []
    currentIndex.value = -1
  } finally {
    loading.value = false
  }
}

// 确认：回调已选地区并关闭
const handleConfirm = () => {
  emit('confirm', selectedCities.value)
  emit('update:modelValue', false)
}

// 打开弹窗或参数变化时加载数据
watch(
  [() => props.modelValue, () => props.categoryId, () => props.metadataId, () => props.gameId],
  ([visible]) => {
    if (visible) {
      selectedCities.value = []
      fetchData()
    }
  }
)
</script>

<style scoped>
.city-selection {
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

/* 已选地区 */
.selected-region {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 14px;
  margin-bottom: 12px;
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 8px;
}

.selected-region-label {
  font-size: 14px;
  font-weight: bold;
  color: #67c23a;
}

.selected-region-empty {
  font-size: 13px;
  color: #b1b3b8;
}

.selected-city-tag {
  padding: 2px 8px;
  background: #67c23a;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
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

.package-group.disabled {
  opacity: 0.5;
}

.package-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #f5f7fa;
  font-size: 15px;
  font-weight: bold;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
}

.current-tag {
  padding: 1px 6px;
  background: #409eff;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: normal;
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
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.city-item:hover {
  border-color: #667eea;
}

.city-item.active {
  border-color: #409eff;
  background: #ecf5ff;
  color: #409eff;
}

.city-item.disabled {
  cursor: not-allowed;
  color: #c0c4cc;
  background: #f5f7fa;
}

/* 弹窗底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  border: 1px solid #dcdfe6;
  background: white;
  color: #606266;
}

.cancel-btn:hover {
  border-color: #c0c4cc;
  color: #303133;
}

.confirm-btn {
  border: none;
  background: #409eff;
  color: white;
  font-weight: bold;
}

.confirm-btn:hover {
  opacity: 0.8;
}
</style>
