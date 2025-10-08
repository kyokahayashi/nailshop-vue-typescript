<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'navigate'): void
}>()

const router = useRouter()

const links = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
  { label: 'Admin', to: '/admin' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout', to: '/checkout' },
]

const close = () => {
  emit('update:open', false)
}

const handleNavigate = async (path: string) => {
  await router.push(path)
  close()
  emit('navigate')
}
</script>

<template>
  <transition name="drawer-fade">
    <div v-if="props.open" class="drawer-overlay" @click.self="close">
      <aside class="drawer-panel">
        <div class="drawer-header">
          <span class="drawer-title">メニュー</span>
          <button type="button" class="drawer-close" @click="close">
            <span class="visually-hidden">閉じる</span>
            ×
          </button>
        </div>
        <nav class="drawer-nav">
          <button
            v-for="link in links"
            :key="link.to"
            type="button"
            class="drawer-link"
            @click="handleNavigate(link.to)"
          >
            {{ link.label }}
          </button>
        </nav>
      </aside>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(33, 16, 44, 0.45);
  display: flex;
  justify-content: flex-start;
  z-index: 30;
}

.drawer-panel {
  width: min(80%, 320px);
  background: var(--color-surface);
  padding: 2rem 1.75rem;
  border-top-right-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-secondary);
}

.drawer-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--color-secondary);
}

.drawer-nav {
  display: grid;
  gap: 0.75rem;
}

.drawer-link {
  background: rgba(199, 107, 175, 0.12);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-secondary);
  text-align: left;
  transition: background 0.2s ease;
}

.drawer-link:hover {
  background: rgba(199, 107, 175, 0.2);
}

@media (min-width: 900px) {
  .drawer-overlay {
    display: none;
  }
}
</style>
