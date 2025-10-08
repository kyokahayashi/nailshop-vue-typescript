<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useNailStore } from '@/modules/nails/stores/useNailStore'
import { useCartStore } from '@/modules/cart/stores/useCartStore'
import ProductCard from '@/components/common/ProductCard.vue'

const router = useRouter()
const nailStore = useNailStore()
const cartStore = useCartStore()
const { items, filteredItems, isLoading } = storeToRefs(nailStore)

onMounted(async () => {
  if (!items.value.length) {
    await nailStore.loadProducts()
  }
})

const featuredProducts = computed(() => items.value.slice(0, 3))
const catalogPreview = computed(() => filteredItems.value.slice(0, 6))

const handleSelect = async (id: string) => {
  await nailStore.highlightProduct(id)
  await router.push({ name: 'checkout', query: { productId: id } })
}

const handleAddToCart = (id: string) => {
  const product = items.value.find((entry) => entry.id === id)
  if (product) {
    cartStore.addItem(product)
  }
}
</script>

<template>
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow-pill">Nail Atelier</span>
        <h1>
          季節を纏うネイルチップを<br />
          クリエイターから直接お届け
        </h1>
        <p class="text-muted">
          カラー、季節、デザイン別に検索し、気に入った作品をそのままお取り寄せ。管理ページからの登録も簡単で、デモ購入フローもすぐに試せます。
        </p>
        <div class="cta-group">
          <RouterLink to="/search" class="btn btn-primary">カタログを検索</RouterLink>
          <RouterLink to="/admin" class="btn btn-secondary">作品を登録する</RouterLink>
        </div>
      </div>
      <div class="hero-visual">
        <img src="/images/hero-showcase.svg" alt="Nail design showcase" />
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container stack-lg">
      <div class="section-header">
        <h2>新着デザイン</h2>
        <RouterLink to="/search" class="btn btn-text">すべて見る</RouterLink>
      </div>
      <div class="grid grid-cols-3">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
          @select="handleSelect"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container stack-lg">
      <div class="section-header">
        <div class="section-label">
          <h2>おすすめコレクション</h2>
          <span class="badge badge-accent">リアルタイム更新</span>
        </div>
        <button type="button" class="btn btn-text" @click="nailStore.loadProducts" :disabled="isLoading">
          最新の状態に更新
        </button>
      </div>

      <div class="grid grid-cols-3">
        <ProductCard
          v-for="product in catalogPreview"
          :key="product.id"
          :product="product"
          @select="handleSelect"
          @add-to-cart="handleAddToCart"
        />
      </div>

      <div v-if="!catalogPreview.length && !isLoading" class="alert">
        対象の商品が見つかりませんでした。フィルタ条件を調整するか、新しい商品を登録してください。
      </div>

      <div v-if="isLoading" class="loading">読み込み中...</div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  padding: 5rem 0 4rem;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(199, 107, 175, 0.12), rgba(73, 197, 182, 0.12));
  z-index: -1;
}

.hero-copy {
  display: grid;
  gap: 1.5rem;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  line-height: 1.2;
  color: var(--color-secondary);
}

.cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-visual img {
  width: 100%;
  max-width: 360px;
  border-radius: var(--radius-lg);
  box-shadow: 0 28px 60px rgba(199, 107, 175, 0.24);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.section-header h2 {
  margin: 0;
  font-size: 2rem;
  color: var(--color-secondary);
}

.section-label {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.loading {
  text-align: center;
  padding: 1rem 0;
  color: var(--color-muted);
}

@media (max-width: 900px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .cta-group .btn {
    width: 100%;
  }
}
</style>
