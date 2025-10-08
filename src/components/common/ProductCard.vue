<script setup lang="ts">
import type { NailProduct } from '@/modules/nails/types'

import { RouterLink } from 'vue-router'

const props = defineProps<{
  product: NailProduct
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'add-to-cart', id: string): void
}>()

const handleSelect = () => {
  emit('select', props.product.id)
}

const handleAddToCart = () => {
  emit('add-to-cart', props.product.id)
}

</script>

<template>
  <article class="product-card">
    <div class="product-thumb">
      <img :src="product.image" :alt="product.title" loading="lazy" />
    </div>
    <div class="product-body">
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-tags">
        <span class="pill">{{ product.color }}</span>
        <span class="pill alt">{{ product.season }}</span>
        <span class="pill soft">{{ product.design }}</span>
      </div>
      <p class="product-description">
        {{ product.description }}
      </p>
    </div>
    <div class="product-footer">
      <span class="product-price">¥{{ product.price.toLocaleString() }}</span>
      <div class="product-actions">
        <button type="button" class="btn btn-secondary" @click="handleAddToCart">
          カートに追加
        </button>
        <RouterLink
          :to="{ name: 'product-detail', params: { id: product.id } }"
          class="btn btn-text"
        >
          詳細
        </RouterLink>
        <button type="button" class="btn btn-accent" @click="handleSelect">購入</button>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.product-card {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.6rem;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: 0 18px 42px rgba(94, 75, 140, 0.14);
  border: 1px solid transparent;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  min-height: 100%;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 50px rgba(94, 75, 140, 0.18);
  border-color: rgba(94, 75, 140, 0.18);
}

.product-thumb {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-primary-soft);
  aspect-ratio: 16 / 9;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-body {
  display: grid;
  gap: 0.9rem;
}

.product-title {
  font-size: 1.2rem;
  margin: 0;
  font-weight: 700;
  color: var(--color-secondary);
  line-height: 1.35;
}

.product-tags {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.product-description {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.product-price {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.product-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.product-actions .btn {
  flex: 1 1 120px;
}

@media (max-width: 640px) {
  .product-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-actions {
    width: 100%;
    gap: 0.6rem;
  }

  .product-actions .btn {
    width: 100%;
    justify-content: center;
    flex: 1 1 auto;
  }
}
</style>
