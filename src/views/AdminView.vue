<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ProductForm from '@/components/forms/ProductForm.vue'
import { useNailStore } from '@/modules/nails/stores/useNailStore'
import {
  nailColors,
  nailDesigns,
  nailSeasons,
  type CreateNailPayload,
} from '@/modules/nails/types'

const nailStore = useNailStore()
const { items, isLoading } = storeToRefs(nailStore)

const editingId = ref<string | null>(null)
const message = ref<string | null>(null)
const snackbar = ref(false)
const messageColor = ref<'success' | 'error'>('success')
let hideTimer: number | undefined

const displayMessage = (text: string, color: 'success' | 'error') => {
  message.value = text
  messageColor.value = color
  snackbar.value = true
  clearTimeout(hideTimer)
  hideTimer = window.setTimeout(() => {
    snackbar.value = false
  }, 2500)
}

onMounted(async () => {
  if (!items.value.length) {
    await nailStore.loadProducts()
  }
})

const editingProduct = computed(() =>
  items.value.find((item) => item.id === editingId.value),
)

const handleSubmit = async (payload: CreateNailPayload) => {
  try {
    if (editingId.value) {
      await nailStore.updateProduct(editingId.value, payload)
      displayMessage('商品を更新しました。', 'success')
    } else {
      await nailStore.createProduct(payload)
      displayMessage('商品を登録しました。', 'success')
    }
    editingId.value = null
  } catch (error) {
    console.error(error)
    const content =
      error instanceof Error ? error.message : '保存に失敗しました。もう一度お試しください。'
    displayMessage(content, 'error')
  }
}

const handleEdit = (id: string) => {
  editingId.value = id
}

const handleDelete = async (id: string) => {
  try {
    await nailStore.removeProduct(id)
    displayMessage('商品を削除しました。', 'success')
  } catch (error) {
    const content =
      error instanceof Error ? error.message : '削除に失敗しました。もう一度試してください。'
    displayMessage(content, 'error')
  }
}

onBeforeUnmount(() => {
  clearTimeout(hideTimer)
})
</script>

<template>
  <section class="section">
    <div class="container admin-layout">
      <aside class="admin-panel card">
        <h2>{{ editingId ? '商品編集' : '新規登録' }}</h2>
        <p class="text-muted text-small">
          JSON Server や Firestore のエンドポイントに接続できる CRUD フォームです。
        </p>
        <ProductForm
          :model-value="editingProduct"
          :colors="nailColors"
          :seasons="nailSeasons"
          :designs="nailDesigns"
          :submit-label="editingId ? '更新する' : '登録する'"
          @submit="handleSubmit"
          @cancel="editingId = null"
        />
      </aside>

      <div class="admin-content">
        <header class="admin-header">
          <div>
            <h1>商品管理</h1>
            <p class="text-muted text-small">
              現在 {{ items.length }} 件登録済み。カード右上から編集・削除できます。
            </p>
          </div>
          <button type="button" class="btn btn-text" @click="nailStore.loadProducts" :disabled="isLoading">
            再取得
          </button>
        </header>

        <div class="grid grid-cols-2">
          <article v-for="item in items" :key="item.id" class="inventory-card card">
            <div class="inventory-thumb">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="inventory-body">
              <div>
                <h3>{{ item.title }}</h3>
                <p class="text-muted">
                  ¥{{ item.price.toLocaleString() }} / {{ item.season }} / {{ item.design }}
                </p>
              </div>
              <p class="description">{{ item.description }}</p>
            </div>
            <div class="inventory-actions">
              <button type="button" class="btn btn-secondary" @click="handleEdit(item.id)">編集</button>
              <button type="button" class="btn btn-text" @click="handleDelete(item.id)">削除</button>
            </div>
          </article>
        </div>

        <div v-if="isLoading" class="loading">読み込み中...</div>
      </div>
    </div>

    <transition name="toast-fade">
      <div v-if="snackbar && message" class="toast" :class="messageColor">
        {{ message }}
      </div>
    </transition>
  </section>
</template>

<style scoped lang="scss">
.admin-layout {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  align-items: start;
}

.admin-panel {
  position: sticky;
  top: 100px;
  display: grid;
  gap: 1.2rem;
}

.admin-panel h2 {
  margin: 0;
  font-size: 1.6rem;
  color: var(--color-secondary);
}

.admin-content {
  display: grid;
  gap: 1.75rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.admin-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--color-secondary);
}

.inventory-card {
  display: grid;
  gap: 1.2rem;
  padding: 1.4rem;
}

.inventory-thumb {
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-primary-soft);
  aspect-ratio: 16 / 9;
}

.inventory-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inventory-body {
  display: grid;
  gap: 0.6rem;
}

.inventory-body h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-secondary);
}

.inventory-body .description {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.inventory-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--color-secondary);
  color: #fff;
  padding: 0.85rem 1.4rem;
  border-radius: var(--radius-sm);
  box-shadow: 0 18px 32px rgba(94, 75, 140, 0.25);
}

.toast.success {
  background: var(--color-primary);
}

.toast.error {
  background: #e57373;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.loading {
  text-align: center;
  color: var(--color-muted);
}

@media (max-width: 1080px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .admin-panel {
    position: static;
  }
}

@media (max-width: 640px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .inventory-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .inventory-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
