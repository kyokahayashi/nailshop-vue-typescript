<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppNavigationDrawer from '@/components/layout/AppNavigationDrawer.vue'
import { useCartStore } from '@/modules/cart/stores/useCartStore'
import { storeToRefs } from 'pinia'

const isDrawerOpen = ref(false)

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const cartStore = useCartStore()
const { lastAddedTitle, itemCount } = storeToRefs(cartStore)
const cartToastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

watch(lastAddedTitle, (title) => {
  if (!title) return
  cartToastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    cartToastVisible.value = false
    cartStore.resetLastAdded()
  }, 2400)
})

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <div class="app-shell">
    <AppHeader @toggle-drawer="toggleDrawer" />
    <AppNavigationDrawer v-model:open="isDrawerOpen" @navigate="isDrawerOpen = false" />
    <main class="app-main">
      <RouterView />
    </main>
    <AppFooter />
    <transition name="toast-fade">
      <div v-if="cartToastVisible && lastAddedTitle" class="toast cart-toast">
        「{{ lastAddedTitle }}」をカートに追加しました（合計 {{ itemCount }} 件）
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--color-secondary);
  color: #fff;
  padding: 0.85rem 1.4rem;
  border-radius: var(--radius-sm);
  box-shadow: 0 18px 32px rgba(94, 75, 140, 0.25);
  z-index: 50;
}

.cart-toast {
  background: var(--color-primary);
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

@media (max-width: 600px) {
  .toast {
    left: 16px;
    right: 16px;
    bottom: 16px;
    text-align: center;
  }
}
</style>
