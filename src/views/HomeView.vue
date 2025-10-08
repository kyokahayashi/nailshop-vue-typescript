<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useNailStore } from '@/modules/nails/stores/useNailStore'
import ProductCard from '@/components/common/ProductCard.vue'
import NailDetailDialog from '@/modules/nails/components/NailDetailDialog.vue'

const router = useRouter()
const nailStore = useNailStore()
const { items, filteredItems, isLoading, selectedProduct } = storeToRefs(nailStore)

const isDetailOpen = ref(false)

onMounted(async () => {
  if (!items.value.length) {
    await nailStore.loadProducts()
  }
})

const featuredProducts = computed(() => items.value.slice(0, 3))
const catalogPreview = computed(() => filteredItems.value.slice(0, 6))

const handleView = async (id: string) => {
  await nailStore.highlightProduct(id)
  isDetailOpen.value = true
}

const handleSelect = async (id: string) => {
  await nailStore.highlightProduct(id)
  await router.push({ name: 'checkout', query: { productId: id } })
}
</script>

<template>
  <section class="hero-section">
    <v-container class="py-16">
      <v-row align="center">
        <v-col cols="12" md="7">
          <p class="text-overline text-secondary font-weight-bold">Nail Atelier</p>
          <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
            季節を纏うネイルチップを<br />
            クリエイターから直接お届け
          </h1>
          <p class="text-body-1 text-medium-emphasis mb-6">
            カラー、季節、デザイン別に検索し、気に入った作品をそのままお取り寄せ。管理ページからの登録も簡単で、デモ購入フローもすぐに試せます。
          </p>
          <div class="d-flex ga-4 flex-wrap">
            <v-btn color="primary" variant="flat" size="large" to="/search">
              カタログを検索
            </v-btn>
            <v-btn color="secondary" variant="outlined" size="large" to="/admin">
              作品を登録する
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <v-img
            src="/images/hero-showcase.svg"
            alt="Nail design showcase"
            class="rounded-xl elevation-5"
            height="320"
            cover
          />
        </v-col>
      </v-row>
    </v-container>
  </section>

  <v-container class="py-12">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h4 font-weight-semibold">新着デザイン</h2>
      <v-btn variant="text" color="secondary" to="/search">
        すべて見る
      </v-btn>
    </div>
    <v-row>
      <v-col
        v-for="product in featuredProducts"
        :key="product.id"
        cols="12"
        md="4"
        sm="6"
      >
        <ProductCard :product="product" @view="handleView" @select="handleSelect" />
      </v-col>
    </v-row>
  </v-container>

  <v-container class="py-12">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h4 font-weight-semibold">おすすめコレクション</h2>
      <v-chip color="accent" variant="flat" class="text-primary">
        <v-icon start icon="mdi-timer-refresh" />
        リアルタイム更新
      </v-chip>
    </div>

    <v-row>
      <v-col cols="12" md="3" sm="6" v-for="product in catalogPreview" :key="product.id">
        <ProductCard :product="product" @view="handleView" @select="handleSelect" />
      </v-col>
      <v-col v-if="!catalogPreview.length && !isLoading" cols="12">
        <v-alert color="secondary" variant="tonal">
          対象の商品が見つかりませんでした。フィルタ条件を調整するか、新しい商品を登録してください。
        </v-alert>
      </v-col>
      <v-col v-if="isLoading" cols="12">
        <v-progress-linear indeterminate color="secondary" />
      </v-col>
    </v-row>
  </v-container>

  <NailDetailDialog
    v-model:open="isDetailOpen"
    :product="selectedProduct"
  />
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, rgba(199, 107, 175, 0.12), rgba(73, 197, 182, 0.12));
}
</style>
