<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type {
  NailColor,
  NailDesign,
  NailFilters,
  NailSeason,
} from '@/modules/nails/types'

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

const priceMin = computed<number>({
  get: () => state.priceRange[0],
  set: (value) => {
    const numeric = Number.isFinite(value) ? Number(value) : 0
    state.priceRange[0] = Math.max(0, Math.min(numeric, state.priceRange[1]))
  },
})

const priceMax = computed<number>({
  get: () => state.priceRange[1],
  set: (value) => {
    const numeric = Number.isFinite(value) ? Number(value) : 0
    state.priceRange[1] = Math.max(numeric, state.priceRange[0])
  },
})

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
  <aside class="filter-card card">
    <header class="filter-header">
      <h2>検索フィルタ</h2>
      <p class="text-muted text-small">
        キーワードやタグ、価格帯でカタログを絞り込みできます。
      </p>
    </header>

    <div class="stack">
      <label class="field">
        <span>キーワード</span>
        <input
          v-model="state.keyword"
          type="search"
          class="input"
          placeholder="春色 / ピンク / グラデーション など"
          @keyup.enter="handleSearch"
        />
      </label>

      <div class="field">
        <span>カラー</span>
        <div class="checkbox-group">
          <label
            v-for="color in colors"
            :key="color"
            class="checkbox-label"
            :class="{ active: state.colors.includes(color as NailColor) }"
          >
            <input type="checkbox" :value="color" v-model="state.colors" />
            {{ color }}
          </label>
        </div>
      </div>

      <div class="field">
        <span>季節</span>
        <div class="checkbox-group">
          <label
            v-for="season in seasons"
            :key="season"
            class="checkbox-label"
            :class="{ active: state.seasons.includes(season as NailSeason) }"
          >
            <input type="checkbox" :value="season" v-model="state.seasons" />
            {{ season }}
          </label>
        </div>
      </div>

      <div class="field">
        <span>デザイン</span>
        <div class="checkbox-group">
          <label
            v-for="design in designs"
            :key="design"
            class="checkbox-label"
            :class="{ active: state.designs.includes(design as NailDesign) }"
          >
            <input type="checkbox" :value="design" v-model="state.designs" />
            {{ design }}
          </label>
        </div>
      </div>

      <div class="field">
        <span>価格帯</span>
        <div class="price-inputs">
          <input
            type="number"
            class="number-input"
            min="0"
            step="100"
            v-model.number="priceMin"
          />
          <span class="price-separator">〜</span>
          <input
            type="number"
            class="number-input"
            min="0"
            step="100"
            v-model.number="priceMax"
          />
        </div>
        <span class="text-muted text-small">100円単位で指定できます。</span>
      </div>
    </div>

    <div class="filter-actions">
      <button type="button" class="btn btn-text" @click="handleReset">リセット</button>
      <button type="button" class="btn btn-primary" @click="handleSearch">
        検索する
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.filter-card {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.filter-header h2 {
  margin: 0;
  font-size: 1.45rem;
  color: var(--color-secondary);
}

.checkbox-group {
  margin-top: 0.4rem;
}

.checkbox-label {
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.number-input {
  width: 100%;
}

.price-separator {
  color: var(--color-muted);
  font-weight: 600;
}

.filter-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.filter-actions .btn {
  min-width: 120px;
}

@media (max-width: 900px) {
  .filter-card {
    position: sticky;
    top: 100px;
  }
}

@media (max-width: 600px) {
  .filter-actions {
    flex-direction: column;
  }

  .filter-actions .btn {
    width: 100%;
  }
}
</style>
