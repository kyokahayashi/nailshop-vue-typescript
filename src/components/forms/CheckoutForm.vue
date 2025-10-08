<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{
  productTitle?: string
  amount: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      name: string
      email: string
      postalCode: string
      prefecture: string
      city: string
      addressLine1: string
      addressLine2: string
      note: string
    },
  ): void
}>()

const form = reactive({
  name: '',
  email: '',
  postalCode: '',
  prefecture: '',
  city: '',
  addressLine1: '',
  addressLine2: '',
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

    <fieldset class="address-group">
      <legend>配送先住所</legend>
      <div class="address-grid">
        <label class="field">
          <span>郵便番号</span>
          <input
            v-model="form.postalCode"
            type="text"
            class="input"
            placeholder="123-4567"
            pattern="^\d{3}-?\d{4}$"
            required
          />
        </label>
        <label class="field">
          <span>都道府県</span>
          <input
            v-model="form.prefecture"
            type="text"
            class="input"
            placeholder="東京都"
            required
          />
        </label>
        <label class="field field-wide">
          <span>市区町村</span>
          <input
            v-model="form.city"
            type="text"
            class="input"
            placeholder="渋谷区"
            required
          />
        </label>
        <label class="field field-wide">
          <span>番地・建物名</span>
          <input
            v-model="form.addressLine1"
            type="text"
            class="input"
            placeholder="神南1-19-11 パークウェースクエア2"
            required
          />
        </label>
        <label class="field field-wide">
          <span>部屋番号・その他</span>
          <input
            v-model="form.addressLine2"
            type="text"
            class="input"
            placeholder="501号室"
          />
        </label>
      </div>
    </fieldset>

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

  .address-group {
    border: 1px solid rgba(94, 75, 140, 0.16);
    border-radius: var(--radius-md);
    padding: 1.2rem 1.4rem;
    display: grid;
    gap: 1rem;
  }

  .address-group legend {
    font-weight: 600;
    color: var(--color-secondary);
    padding: 0 0.4rem;
  }

  .address-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .field-wide {
    grid-column: 1 / -1;
  }

  @media (max-width: 640px) {
    .address-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
