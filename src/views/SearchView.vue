<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/common/ProductCard.vue'
import NailFilterPanel from '@/components/filters/NailFilterPanel.vue'
import { useNailStore } from '@/modules/nails/stores/useNailStore'
import { useCartStore } from '@/modules/cart/stores/useCartStore'

const route = useRoute()
const router = useRouter()
const nailStore = useNailStore()
const cartStore = useCartStore()
const { filteredItems, filters, colorFacets, seasonFacets, designFacets, isLoading } =
  storeToRefs(nailStore)

onMounted(async () => {
  if (!nailStore.items.length) {
    await nailStore.loadProducts()
  }

  const keyword = route.query.q
  if (typeof keyword === 'string' && keyword) {
    nailStore.updateFilters({ keyword })
  }
})

watch(
  () => route.query.q,
  (keyword) => {
    if (typeof keyword === 'string') {
      nailStore.updateFilters({ keyword })
    }
  },
)

const handleFilters = (nextFilters: typeof filters.value) => {
  nailStore.updateFilters(nextFilters)
  router.replace({ query: { ...route.query, q: nextFilters.keyword || undefined } })
}

const handleReset = () => {
  nailStore.resetFilters()
  router.replace({ query: {} })
}

const handleAddToCart = (id: string) => {
  const product = nailStore.items.find((entry) => entry.id === id)
  if (product) {
    cartStore.addItem(product)
  }
}
</script>

<template>
  <section class="section">
    <div class="container search-layout">
      <aside class="search-filters">
        <NailFilterPanel
          :filters="filters"
          :colors="colorFacets"
          :seasons="seasonFacets"
          :designs="designFacets"
          @update:filters="handleFilters"
          @reset="handleReset"
        />
      </aside>

      <div class="search-results">
        <header class="results-header">
          <div>
            <h1>ネイルチップ検索</h1>
            <p class="text-muted">
              条件に一致する商品 {{ filteredItems.length }} 件
            </p>
          </div>
          <button type="button" class="btn btn-text" @click="nailStore.loadProducts" :disabled="isLoading">
            データを再取得
          </button>
        </header>

        <div class="grid grid-cols-3">
          <ProductCard
            v-for="product in filteredItems"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <div v-if="!filteredItems.length && !isLoading" class="alert">
          条件に一致する商品はありません。別のキーワードやフィルタでお試しください。
        </div>

        <div v-if="isLoading" class="loading">読み込み中...</div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.search-layout {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  align-items: start;
}

.search-results {
  display: grid;
  gap: 1.75rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.results-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--color-secondary);
}

.loading {
  text-align: center;
  color: var(--color-muted);
}

@media (max-width: 1080px) {
  .search-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn {
    width: 100%;
  }
}
</style>
