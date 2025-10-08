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
  <v-form @submit.prevent="handleSubmit">
    <v-text-field v-model="form.title" label="タイトル" variant="outlined" required />
    <v-textarea
      v-model="form.description"
      label="説明"
      rows="3"
      auto-grow
      variant="outlined"
      required
    />
    <v-text-field
      v-model.number="form.price"
      type="number"
      min="1000"
      step="100"
      label="価格 (JPY)"
      variant="outlined"
      required
    />
    <v-select
      v-model="form.color"
      :items="colors"
      label="カラー"
      variant="outlined"
      required
    />
    <v-select
      v-model="form.season"
      :items="seasons"
      label="季節"
      variant="outlined"
      required
    />
    <v-select
      v-model="form.design"
      :items="designs"
      label="デザイン"
      variant="outlined"
      required
    />
    <v-text-field
      v-model="form.image"
      label="画像URL / パス"
      hint="Firebase StorageのURLまたはpublicディレクトリのパス"
      persistent-hint
      variant="outlined"
      required
    />
    <div class="d-flex justify-end ga-2 mt-4">
      <v-btn variant="text" color="secondary" @click="emit('cancel')">
        キャンセル
      </v-btn>
      <v-btn color="primary" variant="flat" type="submit">
        {{ submitLabel ?? '保存' }}
      </v-btn>
    </div>
  </v-form>
</template>
