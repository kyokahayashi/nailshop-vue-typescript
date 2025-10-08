<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{
  productTitle?: string
  amount: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: {
    name: string
    email: string
    address: string
    note: string
  }): void
}>()

const form = reactive({
  name: '',
  email: '',
  address: '',
  note: '',
})

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>

<template>
  <v-form class="d-flex flex-column ga-4" @submit.prevent="handleSubmit">
    <v-alert variant="tonal" color="secondary">
      <template #prepend>
        <v-icon color="secondary">mdi-cart-heart</v-icon>
      </template>
      この購入体験はデモ用モックです。入力内容は保存され、実際の決済は行われません。
    </v-alert>

    <v-text-field
      v-model="form.name"
      label="お名前"
      variant="outlined"
      required
    />
    <v-text-field
      v-model="form.email"
      label="メールアドレス"
      variant="outlined"
      type="email"
      required
    />
    <v-textarea
      v-model="form.address"
      label="配送先住所"
      variant="outlined"
      auto-grow
      required
    />
    <v-textarea
      v-model="form.note"
      label="備考"
      rows="2"
      variant="outlined"
    />

    <v-divider />

    <div class="d-flex justify-space-between align-center">
      <div>
        <p class="text-body-2 text-medium-emphasis mb-1">対象商品</p>
        <p class="text-subtitle-1 font-weight-semibold">
          {{ productTitle ?? '未選択' }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-body-2 text-medium-emphasis mb-1">ご請求予定額</p>
        <p class="text-h5 font-weight-bold text-secondary">¥{{ amount.toLocaleString() }}</p>
      </div>
    </div>

    <v-btn color="accent" variant="flat" type="submit" class="text-primary" :disabled="props.disabled">
      デモ購入を完了する
    </v-btn>
  </v-form>
</template>
