<template>
  <div class="buy-container">
    <div class="buy-header">
      <h2>确认订单</h2>
      <p>请确认您要购买的产品信息</p>
    </div>

    <div v-loading="loading" class="product-section">
      <div v-if="selectedProduct" class="product-card selected">
        <div class="product-tag">{{ selectedProduct.tag }}</div>
        <h3 class="product-name">{{ selectedProduct.name }}</h3>
        <div class="product-duration">{{ selectedProduct.duration }}天</div>
        
        <div class="price-section">
          <span class="current-price">¥{{ selectedProduct.price.toFixed(2) }}</span>
          <span class="original-price">¥{{ selectedProduct.fullPrice.toFixed(2) }}</span>
        </div>

        <div class="tips-section">
          <div class="tip-item">
            <span class="tip-label">说明:</span>
            <span class="tip-content">{{ selectedProduct.ttips }}</span>
          </div>
          <div class="tip-item">
            <span class="tip-label">推荐:</span>
            <span class="tip-content">{{ selectedProduct.btips }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="!loading && products.length === 0" class="empty-state">
        <el-empty description="未找到相关产品或产品已下架" />
      </div>
      
      <div v-else-if="!loading && !selectedProduct" class="empty-state">
        <el-empty description="未指定有效的产品ID" />
      </div>
    </div>

    <div class="action-bar">
      <div class="total-info">
        <span>应付金额:</span>
        <span class="total-price">{{ selectedProduct ? '¥' + selectedProduct.price.toFixed(2) : '¥0.00' }}</span>
      </div>
      <el-button 
        type="primary" 
        size="large" 
        :disabled="!selectedProduct"
        @click="handleConfirmPay"
      >
        立即支付
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getProductsByMetadataId } from '@/api/product';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const products = ref<any[]>([]);
const selectedProduct = ref<any>(null);

// 获取 URL 参数
const urlMetadataId = computed(() => Number(route.query.metadataId));
const urlProductId = computed(() => Number(route.query.productId));

// 加载产品列表并自动选中
const loadProducts = async () => {
  if (!urlMetadataId.value || !urlProductId.value) {
    ElMessage.warning('缺少必要的产品参数');
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    // 根据 metadataId 获取产品列表
    const res = await getProductsByMetadataId(urlMetadataId.value);
    products.value = res || [];

    // 自动查找并选中对应的产品 (通过 productId 匹配)
    const found = products.value.find((p: any) => p.id === urlProductId.value);
    
    if (found) {
      selectedProduct.value = found;
    } else {
      ElMessage.error('未找到指定的产品，可能已下架');
      selectedProduct.value = null;
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载产品失败');
  } finally {
    loading.value = false;
  }
};

// 确认支付
const handleConfirmPay = () => {
  if (!selectedProduct.value) {
    ElMessage.warning('请先选择产品');
    return;
  }
  
  // TODO: 调用支付接口
  ElMessage.success(`正在发起支付：${selectedProduct.value.name}`);
  console.log('发起支付', {
    productId: selectedProduct.value.id,
    metadataId: selectedProduct.value.metadataId,
    price: selectedProduct.value.price
  });
};

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.buy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.buy-header {
  text-align: center;
  margin-bottom: 30px;
}

.buy-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.buy-header p {
  color: #999;
  font-size: 14px;
}

.product-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #34B4FE;
  position: relative;
  transition: all 0.3s;
}

.product-tag {
  position: absolute;
  top: -10px;
  left: 20px;
  background: linear-gradient(90deg, #34B4FE, #34B4EE);
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.product-name {
  font-size: 22px;
  color: #333;
  margin: 15px 0 10px;
  text-align: center;
}

.product-duration {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.price-section {
  text-align: center;
  margin: 20px 0;
}

.current-price {
  font-size: 32px;
  color: #f56c6c;
  font-weight: bold;
  margin-right: 10px;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.tips-section {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.tip-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-label {
  color: #666;
  width: 50px;
  flex-shrink: 0;
}

.tip-content {
  color: #333;
}

.action-bar {
  margin-top: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-info {
  font-size: 18px;
  color: #333;
}

.total-price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
  margin-left: 10px;
}

.empty-state {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 50px;
}
</style>
