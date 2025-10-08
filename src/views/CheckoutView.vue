<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import CheckoutForm from '@/components/forms/CheckoutForm.vue'
import { useNailStore } from '@/modules/nails/stores/useNailStore'
import { useOrderStore } from '@/modules/orders/stores/useOrderStore'
import { useCartStore } from '@/modules/cart/stores/useCartStore'

const route = useRoute()
const router = useRouter()
const nailStore = useNailStore()
const orderStore = useOrderStore()
const cartStore = useCartStore()

const { items, isLoading, selectedProduct } = storeToRefs(nailStore)
const { confirmation, isProcessing } = storeToRefs(orderStore)
const { items: cartItems, subtotal: cartSubtotal, itemCount: cartCount } = storeToRefs(cartStore)

const selectedId = ref('')
const isCartCheckout = computed(() => route.query.cart === '1')

onMounted(async () => {
  if (!items.value.length) {
    await nailStore.loadProducts()
  }

  if (isCartCheckout.value) {
    if (!cartCount.value) {
      router.replace({ name: 'cart' })
    }
    return
  }

  const productId = route.query.productId
  if (typeof productId === 'string') {
    selectedId.value = productId
    await nailStore.highlightProduct(productId)
  }
})

watch(selectedId, async (id) => {
  if (!id || isCartCheckout.value) return
  await nailStore.highlightProduct(id)
})

watch(
  () => route.query.cart,
  (value) => {
    if (value === '1') {
      selectedId.value = ''
    }
  },
)

const productOptions = computed(() =>
  items.value.map((item) => ({
    title: `${item.title} (¥${item.price.toLocaleString()})`,
    value: item.id,
  })),
)

const selectedItem = computed(() =>
  items.value.find((item) => item.id === (selectedId.value || selectedProduct.value?.id)),
)

const summaryItems = computed(() => {
  if (isCartCheckout.value) {
    return cartItems.value
  }
  if (selectedItem.value) {
    return [{ product: selectedItem.value, quantity: 1 }]
  }
  return []
})

const formLabel = computed(() =>
  isCartCheckout.value
    ? `カート内の商品（${cartCount.value}件）`
    : selectedItem.value?.title ?? '未選択',
)

const formAmount = computed(() =>
  isCartCheckout.value ? cartSubtotal.value : selectedItem.value?.price ?? 0,
)

const handleSubmit = async (payload: {
  name: string
  email: string
  postalCode: string
  prefecture: string
  city: string
  addressLine1: string
  addressLine2: string
  note: string
}) => {
  const lines = summaryItems.value
  if (!lines.length) return
  await orderStore.submitOrder(payload, lines)
  if (isCartCheckout.value) {
    cartStore.clear()
  }
}

const resetOrder = () => {
  orderStore.reset()
}

const confirmationAddress = computed(() => {
  if (!confirmation.value) return ''
  const { postalCode, prefecture, city, addressLine1, addressLine2 } = confirmation.value.payload
  const prefectureLine = [prefecture, city].filter(Boolean).join('')
  const parts = [postalCode ? `〒${postalCode}` : null, prefectureLine, addressLine1, addressLine2]
  return parts.filter((part) => part && part.trim().length > 0).join(' ')
})
</script>

<template>
  <section class="section">
    <div class="container checkout-layout">
      <div class="card checkout-panel">
        <h2>デモ購入フロー</h2>
        <div v-if="isCartCheckout" class="alert">
          カート内の商品が注文対象です。数量はカート画面で調整できます。
        </div>
        <label v-else class="field">
          <span>購入する作品を選択</span>
          <select v-model="selectedId" class="select" :disabled="isLoading">
            <option value="" disabled>商品を選択してください</option>
            <option v-for="option in productOptions" :key="option.value" :value="option.value">
              {{ option.title }}
            </option>
          </select>
        </label>

        <CheckoutForm
          :product-title="formLabel"
          :amount="formAmount"
          :disabled="!summaryItems.length"
          @submit="handleSubmit"
        />
      </div>

      <div class="checkout-sidebar">
        <div v-if="summaryItems.length" class="card summary-card">
          <div
            v-for="item in summaryItems"
            :key="item.product.id"
            class="summary-line"
          >
            <div class="summary-thumb">
              <img :src="item.product.image" :alt="item.product.title" />
            </div>
            <div class="summary-body">
              <h3>{{ item.product.title }}</h3>
              <p class="text-muted">
                {{ item.product.color }} / {{ item.product.season }} / {{ item.product.design }}
              </p>
              <p class="description">{{ item.product.description }}</p>
              <p class="quantity">数量: {{ item.quantity }}</p>
            </div>
            <div class="summary-price">
              ¥{{ (item.product.price * item.quantity).toLocaleString() }}
            </div>
          </div>
          <div class="alert accent">
            モック注文のため決済は行われません。入力内容は確認ダイアログとして保存されます。
          </div>
        </div>

        <div v-else class="card placeholder-card">
          <p class="text-muted">購入対象の商品を選択してください。</p>
        </div>

        <transition name="toast-fade">
          <div v-if="confirmation" class="card confirmation-card">
            <h4>注文内容を保存しました</h4>
            <p class="text-muted">注文番号: {{ confirmation.id }}</p>
            <ul class="table-list">
              <li>お名前: {{ confirmation.payload.name }}</li>
              <li>メール: {{ confirmation.payload.email }}</li>
              <li>郵便番号: {{ confirmation.payload.postalCode }}</li>
              <li>住所: {{ confirmationAddress }}</li>
              <li>備考: {{ confirmation.payload.note || 'なし' }}</li>
            </ul>
            <div class="confirmation-lines">
              <div v-for="item in confirmation.items" :key="item.product.id" class="line">
                <span>{{ item.product.title }}</span>
                <span>数量 {{ item.quantity }}</span>
                <span>¥{{ item.lineTotal.toLocaleString() }}</span>
              </div>
            </div>
            <p class="total">合計: ¥{{ confirmation.total.toLocaleString() }}</p>
            <button type="button" class="btn btn-text" :disabled="isProcessing" @click="resetOrder">
              フォームをリセット
            </button>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.checkout-layout {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.checkout-panel {
  display: grid;
  gap: 1.5rem;
}

.checkout-panel h2 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-secondary);
}

.checkout-sidebar {
  display: grid;
  gap: 1.5rem;
}

.summary-card {
  display: grid;
  gap: 1.2rem;
}

.summary-line {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 120px) minmax(0, 1fr) auto;
  align-items: center;
}

.summary-thumb {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-primary-soft);
}

.summary-thumb img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.summary-body {
  display: grid;
  gap: 0.75rem;
}

.summary-body h3 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--color-secondary);
}

.summary-body .description {
  margin: 0;
  line-height: 1.55;
  color: var(--color-muted);
}

.summary-body .quantity {
  margin: 0;
  color: var(--color-secondary);
  font-weight: 600;
}

.summary-price {
  font-weight: 700;
  color: var(--color-secondary);
}

.placeholder-card {
  text-align: center;
  padding: 2.4rem 1.5rem;
}

.confirmation-card {
  background: rgba(199, 107, 175, 0.1);
  border: 1px solid rgba(199, 107, 175, 0.2);
  display: grid;
  gap: 0.75rem;
}

.confirmation-card h4 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-secondary);
}

.confirmation-card .table-list {
  margin: 0;
}

.confirmation-card .total {
  font-weight: 700;
  color: var(--color-secondary);
}

.confirmation-lines {
  display: grid;
  gap: 0.6rem;
}

.confirmation-lines .line {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.95rem;
  color: var(--color-muted);
}

@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .summary-line {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .checkout-panel .btn,
  .confirmation-card .btn {
    width: 100%;
  }
}
</style>
