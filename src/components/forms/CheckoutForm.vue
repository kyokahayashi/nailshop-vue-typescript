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
  <form class="checkout-form" @submit.prevent="handleSubmit">
    <div class="alert accent">
      この購入体験はデモ用モックです。入力内容は保存され、実際の決済は行われません。
    </div>

    <label class="field">
      <span>お名前</span>
      <input v-model="form.name" type="text" class="input" required />
    </label>

    <label class="field">
      <span>メールアドレス</span>
      <input v-model="form.email" type="email" class="input" required />
    </label>

    <label class="field">
      <span>配送先住所</span>
      <textarea v-model="form.address" rows="3" class="textarea" required></textarea>
    </label>

    <label class="field">
      <span>備考</span>
      <textarea v-model="form.note" rows="2" class="textarea"></textarea>
    </label>

    <hr class="divider" />

    <div class="summary">
      <div>
        <p class="text-muted text-small mb-2">対象商品</p>
        <p class="text-large">{{ productTitle ?? '未選択' }}</p>
      </div>
      <div class="text-right">
        <p class="text-muted text-small mb-2">ご請求予定額</p>
        <p class="total">¥{{ amount.toLocaleString() }}</p>
      </div>
    </div>

    <button type="submit" class="btn btn-accent" :disabled="props.disabled">
      デモ購入を完了する
    </button>
  </form>
</template>

<style scoped lang="scss">
.checkout-form {
  display: grid;
  gap: 1.2rem;
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.total {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-secondary);
}

@media (max-width: 640px) {
  .summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .checkout-form .btn {
    width: 100%;
  }
}
</style>
