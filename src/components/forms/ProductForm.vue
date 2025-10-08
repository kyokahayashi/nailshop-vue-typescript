<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { CreateNailPayload, NailDesign, NailColor, NailSeason } from '@/modules/nails/types'

const props = defineProps<{
  modelValue?: CreateNailPayload
  submitLabel?: string
  colors: NailColor[]
  seasons: NailSeason[]
  designs: NailDesign[]
}>()

const emit = defineEmits<{
  (e: 'submit', payload: CreateNailPayload): void
  (e: 'cancel'): void
}>()

const form = reactive<CreateNailPayload>({
  title: '',
  description: '',
  price: 1800,
  color: props.colors[0] ?? 'ピンク',
  season: props.seasons[0] ?? '春',
  design: props.designs[0] ?? 'フラワー',
  image: '/images/sakura.svg',
})

watch(
  () => props.modelValue,
  (value) => {
    if (!value) return
    Object.assign(form, value)
  },
  { immediate: true },
)

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="product-form" @submit.prevent="handleSubmit">
    <label class="field">
      <span>タイトル</span>
      <input v-model="form.title" type="text" class="input" required />
    </label>

    <label class="field">
      <span>説明</span>
      <textarea v-model="form.description" rows="4" class="textarea" required></textarea>
    </label>

    <label class="field">
      <span>価格 (JPY)</span>
      <input v-model.number="form.price" type="number" class="number-input" min="0" step="100" required />
    </label>

    <label class="field">
      <span>カラー</span>
      <select v-model="form.color" class="select" required>
        <option v-for="color in colors" :key="color" :value="color">{{ color }}</option>
      </select>
    </label>

    <label class="field">
      <span>季節</span>
      <select v-model="form.season" class="select" required>
        <option v-for="season in seasons" :key="season" :value="season">{{ season }}</option>
      </select>
    </label>

    <label class="field">
      <span>デザイン</span>
      <select v-model="form.design" class="select" required>
        <option v-for="design in designs" :key="design" :value="design">{{ design }}</option>
      </select>
    </label>

    <label class="field">
      <span>画像URL / パス</span>
      <input v-model="form.image" type="text" class="input" required />
      <small class="text-muted text-small">Firebase Storage のURLまたは public ディレクトリのパスを指定してください。</small>
    </label>

    <div class="form-actions">
      <button type="button" class="btn btn-text" @click="emit('cancel')">
        キャンセル
      </button>
      <button type="submit" class="btn btn-primary">
        {{ submitLabel ?? '保存' }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.product-form {
  display: grid;
  gap: 1.2rem;
}

.textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
