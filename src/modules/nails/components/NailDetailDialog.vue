<script setup lang="ts">
import { computed } from 'vue'
import type { NailProduct } from '../types'

const props = defineProps<{
  product: NailProduct | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const formattedCreatedAt = computed(() => {
  if (!props.product) return ''
  return new Date(props.product.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})
</script>

<template>
  <v-dialog
    :model-value="open"
    max-width="640"
    @update:model-value="emit('update:open', $event)"
  >
    <v-card v-if="product" class="rounded-xl">
      <v-img :src="product.image" :alt="product.title" height="260" cover class="bg-primary-soft" />
      <v-card-item>
        <v-card-title class="text-h5 font-weight-semibold">
          {{ product.title }}
        </v-card-title>
        <v-card-subtitle class="text-body-2">
          登録日: {{ formattedCreatedAt }}
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <p class="text-body-1 mb-4">{{ product.description }}</p>
        <v-row>
          <v-col cols="12" sm="4">
            <v-chip color="primary" variant="flat" class="w-100 text-center">
              {{ product.color }}
            </v-chip>
          </v-col>
          <v-col cols="12" sm="4">
            <v-chip color="secondary" variant="tonal" class="w-100 text-center">
              {{ product.season }}
            </v-chip>
          </v-col>
          <v-col cols="12" sm="4">
            <v-chip color="accent" variant="flat" class="w-100 text-center">
              {{ product.design }}
            </v-chip>
          </v-col>
        </v-row>
        <v-alert color="secondary" variant="tonal" class="mt-4">
          <template #prepend>
            <v-icon color="secondary">mdi-information-outline</v-icon>
          </template>
          管理者画面から在庫数や販売状況を更新できます。
        </v-alert>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" color="secondary" @click="emit('update:open', false)">
          閉じる
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
