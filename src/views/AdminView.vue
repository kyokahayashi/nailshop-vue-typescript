<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
      message.value = '商品を更新しました。'
    } else {
      await nailStore.createProduct(payload)
      message.value = '商品を登録しました。'
    }
    messageColor.value = 'success'
    editingId.value = null
    snackbar.value = true
  } catch (error) {
    console.error(error)
    messageColor.value = 'error'
    message.value =
      error instanceof Error ? error.message : '保存に失敗しました。もう一度お試しください。'
    snackbar.value = true
  }
}

const handleEdit = (id: string) => {
  editingId.value = id
}

const handleDelete = async (id: string) => {
  try {
    await nailStore.removeProduct(id)
    messageColor.value = 'success'
    message.value = '商品を削除しました。'
    snackbar.value = true
  } catch (error) {
    messageColor.value = 'error'
    message.value =
      error instanceof Error ? error.message : '削除に失敗しました。もう一度試してください。'
    snackbar.value = true
  }
}
</script>

<template>
  <v-container class="py-12">
    <v-row class="ga-6">
      <v-col cols="12" md="4">
        <v-card class="rounded-xl">
          <v-card-title class="text-h5 font-weight-semibold">
            {{ editingId ? '商品編集' : '新規登録' }}
          </v-card-title>
          <v-card-subtitle class="px-4">
            シンプルなCRUDフォーム。JSON ServerやFirestoreのエンドポイントに接続できます。
          </v-card-subtitle>
          <v-card-text>
            <ProductForm
              :model-value="editingProduct"
              :colors="nailColors"
              :seasons="nailSeasons"
              :designs="nailDesigns"
              :submit-label="editingId ? '更新する' : '登録する'"
              @submit="handleSubmit"
              @cancel="editingId = null"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1 class="text-h4 font-weight-semibold mb-2">商品管理</h1>
            <p class="text-body-2 text-medium-emphasis">
              現在 {{ items.length }} 件登録済み。カード右上から編集・削除できます。
            </p>
          </div>
          <v-btn color="secondary" variant="text" :loading="isLoading" @click="nailStore.loadProducts">
            再取得
          </v-btn>
        </div>

        <v-row>
          <v-col cols="12" md="6" v-for="item in items" :key="item.id">
            <v-card class="rounded-xl">
              <v-img :src="item.image" :alt="item.title" height="160" cover class="bg-primary-soft" />
              <v-card-item>
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <v-card-title class="text-h6">{{ item.title }}</v-card-title>
                    <v-card-subtitle class="text-body-2 text-medium-emphasis">
                      ¥{{ item.price.toLocaleString() }} / {{ item.season }} / {{ item.design }}
                    </v-card-subtitle>
                  </div>
                  <div class="d-flex ga-1">
                    <v-btn icon="mdi-pencil" size="small" variant="text" color="secondary" @click="handleEdit(item.id)" />
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="handleDelete(item.id)"
                    />
                  </div>
                </div>
                <p class="text-body-2 mt-2 text-medium-emphasis">
                  {{ item.description }}
                </p>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
        <v-skeleton-loader
          v-if="isLoading"
          type="card"
          class="rounded-xl"
        />
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="messageColor" timeout="2500">
      {{ message }}
    </v-snackbar>
  </v-container>
</template>
