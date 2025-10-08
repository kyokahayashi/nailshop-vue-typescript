<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { NailFilters } from '@/modules/nails/types'

const props = defineProps<{
  filters: NailFilters
  colors: string[]
  seasons: string[]
  designs: string[]
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: NailFilters): void
  (e: 'reset'): void
}>()

const state = reactive<NailFilters>({ ...props.filters })

watch(
  () => ({ ...props.filters }),
  (next) => {
    Object.assign(state, next)
  },
)

const handleReset = () => {
  emit('reset')
}

const handleSearch = () => {
  const cloned = JSON.parse(JSON.stringify(state)) as NailFilters
  emit('update:filters', cloned)
}
</script>

<template>
  <v-card class="rounded-xl">
    <v-card-title class="text-h6 font-weight-semibold">
      検索フィルタ
    </v-card-title>
    <v-card-text class="d-flex flex-column ga-4">
      <v-text-field
        v-model="state.keyword"
        label="キーワード"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        @keyup.enter="handleSearch"
      />

      <v-select
        v-model="state.colors"
        :items="colors"
        label="カラー"
        multiple
        chips
        variant="outlined"
        hide-details
      />

      <v-select
        v-model="state.seasons"
        :items="seasons"
        label="季節"
        multiple
        chips
        variant="outlined"
        hide-details
      />

      <v-select
        v-model="state.designs"
        :items="designs"
        label="デザイン"
        multiple
        chips
        variant="outlined"
        hide-details
      />

      <div>
        <p class="text-body-2 text-medium-emphasis mb-2">
          価格帯: ¥{{ state.priceRange[0] }} 〜 ¥{{ state.priceRange[1] }}
        </p>
        <v-range-slider
          v-model="state.priceRange"
          :max="5000"
          :min="1000"
          :step="100"
          thumb-label="always"
          color="secondary"
        />
      </div>
    </v-card-text>
    <v-card-actions class="justify-end px-4 pb-4">
      <v-btn variant="text" color="secondary" @click="handleReset">
        リセット
      </v-btn>
      <v-btn color="primary" variant="flat" @click="handleSearch">
        <v-icon start icon="mdi-magnify" />
        検索する
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
