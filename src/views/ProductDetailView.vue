<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useNailStore } from '@/modules/nails/stores/useNailStore'

const props = defineProps<{ id: string }>()

const router = useRouter()
const route = useRoute()
const nailStore = useNailStore()
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
</script>

<template>
  <v-container class="py-12">
    <v-breadcrumbs :items="[
      { title: 'ホーム', to: '/' },
      { title: '検索', to: '/search' },
      { title: selectedProduct?.title ?? '詳細' },
    ]" class="mb-6" />

    <v-row>
      <v-col cols="12" md="6">
        <v-skeleton-loader v-if="isLoading" type="image" height="320" />
        <v-img
          v-else-if="selectedProduct"
          :src="selectedProduct.image"
          :alt="selectedProduct.title"
          height="320"
          class="rounded-xl bg-primary-soft"
          cover
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="rounded-xl" v-if="selectedProduct">
          <v-card-item>
            <v-card-title class="text-h4">
              {{ selectedProduct.title }}
            </v-card-title>
            <v-card-subtitle class="text-body-2 text-medium-emphasis">
              {{ selectedProduct.color }} / {{ selectedProduct.season }} / {{ selectedProduct.design }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <p class="text-body-1 mb-4">{{ selectedProduct.description }}</p>
            <p class="text-h5 font-weight-semibold mb-6">¥{{ selectedProduct.price.toLocaleString() }}</p>
            <v-btn color="accent" variant="flat" class="text-primary" @click="goToCheckout">
              デモ購入を開始
            </v-btn>
          </v-card-text>
        </v-card>
        <v-alert v-else type="warning" variant="tonal">
          商品が見つかりませんでした。<RouterLink to="/search">検索ページ</RouterLink>に戻ってください。
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
