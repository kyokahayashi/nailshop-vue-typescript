<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/common/ProductCard.vue'
import NailFilterPanel from '@/components/filters/NailFilterPanel.vue'
import NailDetailDialog from '@/modules/nails/components/NailDetailDialog.vue'
import { useNailStore } from '@/modules/nails/stores/useNailStore'

const route = useRoute()
const router = useRouter()
const nailStore = useNailStore()
const { filteredItems, filters, colorFacets, seasonFacets, designFacets, isLoading, selectedProduct } =
  storeToRefs(nailStore)

const isDetailOpen = ref(false)

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

const handleView = async (id: string) => {
  await nailStore.highlightProduct(id)
  isDetailOpen.value = true
}
</script>

<template>
  <v-container class="py-12">
    <v-row class="ga-6" align="start">
      <v-col cols="12" md="4">
        <NailFilterPanel
          :filters="filters"
          :colors="colorFacets"
          :seasons="seasonFacets"
          :designs="designFacets"
          @update:filters="handleFilters"
          @reset="handleReset"
        />
      </v-col>
      <v-col cols="12" md="8">
        <header class="d-flex justify-space-between align-center mb-4 flex-wrap ga-2">
          <div>
            <h1 class="text-h4 font-weight-semibold mb-2">ネイルチップ検索</h1>
            <p class="text-body-2 text-medium-emphasis">
              条件に一致する商品 {{ filteredItems.length }} 件
            </p>
          </div>
          <v-btn color="secondary" variant="text" :loading="isLoading" @click="nailStore.loadProducts">
            再取得
          </v-btn>
        </header>

        <v-row>
          <v-col
            v-for="product in filteredItems"
            :key="product.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <ProductCard :product="product" @view="handleView" />
          </v-col>

          <v-col cols="12" v-if="!filteredItems.length && !isLoading">
            <v-alert variant="tonal" color="secondary">
              条件に一致する商品はありません。別のキーワードやフィルタでお試しください。
            </v-alert>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <NailDetailDialog
    v-model:open="isDetailOpen"
    :product="selectedProduct"
  />
</template>
