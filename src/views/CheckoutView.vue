<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import CheckoutForm from '@/components/forms/CheckoutForm.vue'
import { useNailStore } from '@/modules/nails/stores/useNailStore'
import { useOrderStore } from '@/modules/orders/stores/useOrderStore'

const route = useRoute()
const nailStore = useNailStore()
const orderStore = useOrderStore()

const { items, isLoading, selectedProduct } = storeToRefs(nailStore)
const { confirmation, isProcessing } = storeToRefs(orderStore)

const selectedId = ref<string | null>(null)

onMounted(async () => {
  if (!items.value.length) {
    await nailStore.loadProducts()
  }

  const productId = route.query.productId
  if (typeof productId === 'string') {
    selectedId.value = productId
    await nailStore.highlightProduct(productId)
  }
})

watch(selectedId, async (id) => {
  if (id) {
    await nailStore.highlightProduct(id)
  }
})

const productOptions = computed(() =>
  items.value.map((item) => ({
    title: `${item.title} (¥${item.price.toLocaleString()})`,
    value: item.id,
  })),
)

const selectedItem = computed(() =>
  items.value.find((item) => item.id === (selectedId.value ?? selectedProduct.value?.id)),
)

const handleSubmit = async (payload: {
  name: string
  email: string
  address: string
  note: string
}) => {
  if (!selectedItem.value) return
  await orderStore.submitOrder(payload, [selectedItem.value])
}

const resetOrder = () => {
  orderStore.reset()
}
</script>

<template>
  <v-container class="py-12">
    <v-row class="ga-6">
      <v-col cols="12" md="6">
        <v-card class="rounded-xl">
          <v-card-title class="text-h5 font-weight-semibold">
            デモ購入フロー
          </v-card-title>
          <v-card-text class="d-flex flex-column ga-4">
            <v-select
              v-model="selectedId"
              :items="productOptions"
              item-title="title"
              item-value="value"
              label="購入する作品を選択"
              variant="outlined"
              :loading="isLoading"
            />
            <CheckoutForm
              :product-title="selectedItem?.title"
              :amount="selectedItem?.price ?? 0"
              :disabled="!selectedItem"
              @submit="handleSubmit"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="rounded-xl" v-if="selectedItem">
          <v-img
            :src="selectedItem.image"
            :alt="selectedItem.title"
            height="220"
            cover
            class="bg-primary-soft"
          />
          <v-card-item>
            <v-card-title class="text-h5">
              {{ selectedItem.title }}
            </v-card-title>
            <v-card-subtitle class="text-body-2 text-medium-emphasis">
              {{ selectedItem.color }} / {{ selectedItem.season }} / {{ selectedItem.design }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <p class="text-body-1 mb-4">{{ selectedItem.description }}</p>
            <v-alert color="accent" variant="tonal">
              <template #prepend>
                <v-icon color="accent">mdi-shield-check</v-icon>
              </template>
              モック注文のため決済は行われません。入力内容は確認ダイアログとして保存されます。
            </v-alert>
          </v-card-text>
        </v-card>

        <v-card class="rounded-xl" v-else>
          <v-card-text class="d-flex flex-column align-center text-medium-emphasis ga-2">
            <v-icon size="64" color="secondary">mdi-cart-heart</v-icon>
            <p>購入対象の商品を選択してください。</p>
          </v-card-text>
        </v-card>

        <v-expand-transition>
          <v-card v-if="confirmation" class="rounded-xl mt-6" color="primary" variant="tonal">
            <v-card-item>
              <v-card-title class="text-h6">注文内容を保存しました</v-card-title>
              <v-card-subtitle>注文番号: {{ confirmation.id }}</v-card-subtitle>
            </v-card-item>
            <v-card-text>
              <p class="text-body-2 mb-2">
                お名前: {{ confirmation.payload.name }} / メール: {{ confirmation.payload.email }}
              </p>
              <p class="text-body-2 mb-2">
                配送先: {{ confirmation.payload.address }}
              </p>
              <p class="text-body-2 mb-4">
                備考: {{ confirmation.payload.note || 'なし' }}
              </p>
              <p class="text-h6 font-weight-bold">合計: ¥{{ confirmation.total.toLocaleString() }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="secondary" variant="text" :loading="isProcessing" @click="resetOrder">
                フォームをリセット
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>
