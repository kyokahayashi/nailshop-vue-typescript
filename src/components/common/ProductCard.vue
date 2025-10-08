<script setup lang="ts">
import type { NailProduct } from '@/modules/nails/types'

const props = defineProps<{
  product: NailProduct
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'view', id: string): void
}>()

const handleView = () => {
  emit('view', props.product.id)
}

const handleSelect = () => {
  emit('select', props.product.id)
}
</script>

<template>
  <v-card elevation="2" class="rounded-xl h-100">
    <v-img :src="product.image" :alt="product.title" height="180" cover class="bg-primary-soft" />
    <v-card-item class="pb-0">
      <v-card-title class="text-h6 font-weight-medium line-clamp-2">
        {{ product.title }}
      </v-card-title>
      <v-card-subtitle class="text-body-2 d-flex align-center ga-2">
        <v-chip size="x-small" variant="flat" color="primary">{{ product.color }}</v-chip>
        <v-chip size="x-small" variant="outlined" color="secondary">{{ product.season }}</v-chip>
        <v-chip size="x-small" variant="text" color="secondary">{{ product.design }}</v-chip>
      </v-card-subtitle>
    </v-card-item>
    <v-card-text class="text-body-2 text-medium-emphasis line-clamp-3">
      {{ product.description }}
    </v-card-text>
    <v-divider class="mx-4" />
    <v-card-actions class="justify-space-between px-4 pb-4">
      <span class="text-h6 font-weight-semibold text-secondary">
        ¥{{ product.price.toLocaleString() }}
      </span>
      <div class="d-flex ga-2">
        <v-btn color="secondary" variant="text" @click="handleView">
          詳細
        </v-btn>
        <v-btn color="accent" variant="flat" class="text-primary" @click="handleSelect">
          チェックアウト
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
