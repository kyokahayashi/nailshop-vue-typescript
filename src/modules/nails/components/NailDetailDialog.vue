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
  <transition name="modal-fade">
    <div v-if="open && product" class="modal-overlay" @click.self="emit('update:open', false)">
      <article class="modal-card">
        <button type="button" class="modal-close" @click="emit('update:open', false)">
          <span class="visually-hidden">閉じる</span>
          ×
        </button>

        <div class="modal-media">
          <img :src="product.image" :alt="product.title" />
        </div>

        <div class="modal-content">
          <h2>{{ product.title }}</h2>
          <p class="modal-subtitle">登録日: {{ formattedCreatedAt }}</p>
          <p class="modal-description">{{ product.description }}</p>

          <div class="modal-tags">
            <span class="pill">{{ product.color }}</span>
            <span class="pill alt">{{ product.season }}</span>
            <span class="pill soft">{{ product.design }}</span>
          </div>

          <div class="alert">
            管理者画面から在庫数や販売状況を更新できます。
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="emit('update:open', false)">
              閉じる
            </button>
          </div>
        </div>
      </article>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(24, 10, 34, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1.5rem;
  z-index: 40;
}

.modal-card {
  position: relative;
  width: min(640px, 100%);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(33, 16, 44, 0.35);
  display: grid;
  gap: 0;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  color: var(--color-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.modal-media {
  background: var(--color-primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-media img {
  width: 100%;
  height: auto;
}

.modal-content {
  padding: 2rem;
  display: grid;
  gap: 1rem;
}

.modal-content h2 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--color-secondary);
}

.modal-subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(94, 75, 140, 0.7);
}

.modal-description {
  margin: 0;
  line-height: 1.6;
  color: var(--color-muted);
}

.modal-tags {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .modal-content {
    padding: 1.6rem;
  }

  .modal-content h2 {
    font-size: 1.4rem;
  }
}
</style>
