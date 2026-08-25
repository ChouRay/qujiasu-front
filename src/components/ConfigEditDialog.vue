<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑绑定配置"
    width="500px"
    :before-close="handleClose"
  >
    <el-form label-width="100px">
      <!-- 当前已绑定的游戏 -->
      <el-form-item label="当前游戏">
        <span>{{ currentGameName }}</span>
      </el-form-item>

      <!-- 游戏选择下拉框 -->
      <el-form-item label="选择游戏">
        <el-select
          v-model="selectedGameId"
          placeholder="请选择游戏"
          style="width: 100%"
          @change="handleGameChange"
        >
          <el-option
            v-for="game in gameList"
            :key="game.id"
            :label="game.name"
            :value="game.id"
          />
        </el-select>
      </el-form-item>

      <!-- 地区多选框 -->
      <el-form-item label="绑定地区">
        <el-checkbox-group v-model="selectedLocations">
          <div v-for="location in locationList" :key="location.id" style="margin-bottom: 8px">
            <el-checkbox :label="location.id">
              {{ location.cname }} [{{ location.lineNum }}]
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { requestGames, requestLocations, updatePackageConfig } from '@/api/packages'
import { getErrorMessage } from '@/utils/errorMessage'
import { ElMessage } from 'element-plus'

interface GameInfo {
  id: number
  name: string
}

interface LocationInfo {
  id: number
  cname: string
  lineNum: number
}

interface Props {
  modelValue: boolean
  config: {
    orderId: number
    gameId: number
    gameInfo: {
      name: string
    }
    locationList: number[]
  }
  metadataId: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const loading = ref(false)
const gameList = ref<GameInfo[]>([])
const locationList = ref<LocationInfo[]>([])
const selectedGameId = ref<number | null>(null)
const selectedLocations = ref<number[]>([])
const currentGameName = ref('')
const orderId = ref('');

// 同步 v-model
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val
    if (val) {
      initDialog()
    }
  }
)

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

// 初始化对话框
const initDialog = async () => {
  loading.value = true
  try {
    // 初始化当前游戏信息
    currentGameName.value = props.config.gameInfo.name
    selectedGameId.value = props.config.gameId
    orderId.value = props.config.orderId
    selectedLocations.value = [...props.config.locationList]

    // 获取所有游戏列表
    const gameData = await requestGames()
    if (Array.isArray(gameData)) {
      gameList.value = gameData.sort((a, b) => 
        (a.name || '').localeCompare(b.name || '', 'zh-CN')
      )
    }

    // 根据当前游戏加载地区列表    
    if (selectedGameId.value) {      
      await loadLocations(selectedGameId.value)
    }
  } catch (error) {
    // 
    
  } finally {
    loading.value = false
  }
}

// 加载地区列表
const loadLocations = async (gameId: number) => {
  try {
    const params = {metadataId: props.metadataId, gameId:gameId};
    const locations = await requestLocations(params)
    if (Array.isArray(locations)) {
      locationList.value = locations
      // 可选：如果有默认选中的地区，可以在这里设置
      // formData.value.locationIds = [locations[0]?.id].filter(Boolean)
    }
  } catch (error) {    
    console.log('loadLocations',error)
  }
}

// 游戏改变时重新加载地区
const handleGameChange = async (gameId: number) => {
  // 更新当前游戏名称显示
  const game = gameList.value.find((g) => g.id === gameId)
  if (game) {
    currentGameName.value = game.name
  }
  // 清空已选地区
  selectedLocations.value = []
  // 重新加载地区列表
  await loadLocations(gameId)
}

// 确认按钮
const handleConfirm = async () => {
  if (!selectedGameId.value) {
    ElMessage.warning('请选择游戏')
    return
  }

  loading.value = true
  try {
    await updatePackageConfig(orderId.value,{
      gameId: selectedGameId.value,
      locationList: selectedLocations.value
    })
    ElMessage.success('配置更新成功')
    emit('success')
    dialogVisible.value = false
  } catch (error) {
    const errorMsg = error.response?.data?.msg || '修改绑定失败'
    ElMessage.error(getErrorMessage(errorMsg, '创建订单失败'))
  } finally {
    loading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}

onMounted(() => {
  if (dialogVisible.value) {
    initDialog()
  }
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
