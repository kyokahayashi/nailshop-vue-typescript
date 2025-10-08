<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useNailStore } from '@/modules/nails/stores/useNailStore'
import { useCartStore } from '@/modules/cart/stores/useCartStore'

const props = defineProps<{ id: string }>()

const router = useRouter()
const route = useRoute()
const nailStore = useNailStore()
const cartStore = useCartStore()
const { selectedProduct, isLoading } = storeToRefs(nailStore)

const targetId = computed(() => props.id || (route.params.id as string))

onMounted(async () => {
  if (!nailStore.items.length) {
    await nailStore.loadProducts()
  }
  await nailStore.highlightProduct(targetId.value)
})

watch(
  () => props.id,
  async (id) => {
    if (id) {
      await nailStore.highlightProduct(id)
    }
  },
)

const goToCheckout = async () => {
  if (!selectedProduct.value) return
  await router.push({ name: 'checkout', query: { productId: selectedProduct.value.id } })
}

const addToCart = () => {
  if (!selectedProduct.value) return
  cartStore.addItem(selectedProduct.value)
}
</script>

<template>
  <section class="section">
    <div class="container detail-layout">
      <nav class="breadcrumbs">
        <RouterLink to="/">ホーム</RouterLink>
        <span>/</span>
        <RouterLink to="/search">検索</RouterLink>
        <span>/</span>
        <span>{{ selectedProduct?.title ?? '詳細' }}</span>
      </nav>

      <div class="detail-grid">
        <div class="detail-visual">
          <div v-if="isLoading" class="loading">読み込み中...</div>
          <div v-else-if="selectedProduct" class="image-wrapper">
            <img :src="selectedProduct.image" :alt="selectedProduct.title" />
          </div>
        </div>

        <div class="detail-content">
          <div v-if="selectedProduct" class="card">
            <h1>{{ selectedProduct.title }}</h1>
            <p class="text-muted">
              {{ selectedProduct.color }} / {{ selectedProduct.season }} / {{ selectedProduct.design }}
            </p>
            <p class="description">{{ selectedProduct.description }}</p>
            <p class="price">¥{{ selectedProduct.price.toLocaleString() }}</p>
            <div class="detail-actions">
              <button type="button" class="btn btn-secondary" @click="addToCart">
                カートに追加
              </button>
              <button type="button" class="btn btn-accent" @click="goToCheckout">
                デモ購入を開始
              </button>
            </div>
          </div>

          <div v-else class="alert">
            商品が見つかりませんでした。<RouterLink to="/search">検索ページ</RouterLink>に戻ってください。
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.detail-layout {
  display: grid;
  gap: 2rem;
}

.breadcrumbs {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-muted);
}

.breadcrumbs a {
  color: var(--color-secondary);
}

.detail-grid {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.detail-visual .image-wrapper {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-primary-soft);
}

.detail-visual img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.detail-content .card {
  display: grid;
  gap: 1rem;
}

.detail-content h1 {
  margin: 0;
  font-size: 2.2rem;
  color: var(--color-secondary);
}

.description {
  margin: 0;
  line-height: 1.6;
  color: var(--color-muted);
}

.price {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.loading {
  padding: 2rem;
  text-align: center;
  background: rgba(94, 75, 140, 0.08);
  border-radius: var(--radius-md);
}

.detail-actions {
  display: flex;
  gap: 0.75rem;
}

.detail-actions .btn {
  min-width: 140px;
}

@media (max-width: 640px) {
  .detail-actions {
    flex-direction: column;
  }

  .detail-actions .btn {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
