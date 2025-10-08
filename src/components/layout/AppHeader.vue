<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/modules/cart/stores/useCartStore'

defineEmits<{
  (e: 'toggle-drawer'): void
}>()

const route = useRoute()

const links = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
  { label: 'Admin', to: '/admin' },
]

const cartStore = useCartStore()
const { itemCount } = storeToRefs(cartStore)

const currentPath = computed(() => route.path)

const isActive = (path: string) =>
  currentPath.value === path || currentPath.value.startsWith(`${path}/`)
</script>

<template>
  <header class="app-header">
    <div class="container header-inner">
      <button class="nav-toggle" type="button" @click="$emit('toggle-drawer')">
        <span class="visually-hidden">メニューを開く</span>
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
      </button>

      <RouterLink to="/" class="brand">Nail Atelier</RouterLink>

      <nav class="nav-desktop">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'is-active': isActive(link.to) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="nav-actions">
        <RouterLink to="/cart" class="cart-link" :class="{ 'has-items': itemCount > 0 }">
          <span>カート</span>
          <span v-if="itemCount > 0" class="cart-count">{{ itemCount }}</span>
        </RouterLink>
        <RouterLink to="/checkout" class="btn btn-accent nav-cta">
          デモ購入
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
  background: rgba(253, 249, 251, 0.9);
  border-bottom: 1px solid rgba(94, 75, 140, 0.08);
}

.header-inner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
}

.brand {
  font-weight: 700;
  font-size: 1.3rem;
  color: var(--color-secondary);
  letter-spacing: 0.04em;
}

.nav-desktop {
  display: none;
  gap: 1.1rem;
  margin-left: auto;
  margin-right: 1.5rem;
}

.nav-link {
  font-weight: 600;
  color: rgba(94, 75, 140, 0.72);
  padding: 0.35rem 0.1rem;
  position: relative;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.35rem;
  width: 100%;
  height: 3px;
  border-radius: 3px;
  background: transparent;
  transition: background 0.2s ease;
}

.nav-link:hover {
  color: var(--color-secondary);
}

.nav-link.is-active {
  color: var(--color-secondary);
}

.nav-link.is-active::after {
  background: var(--color-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
  color: rgba(94, 75, 140, 0.78);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
}

.cart-link:hover {
  background: rgba(94, 75, 140, 0.1);
  color: var(--color-secondary);
}

.cart-link.has-items {
  background: rgba(199, 107, 175, 0.15);
  color: var(--color-secondary);
}

.cart-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0 0.4rem;
}

.nav-cta {
  display: none;
}

.nav-toggle {
  background: var(--color-primary);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-shadow: 0 10px 20px rgba(199, 107, 175, 0.35);
}

.nav-toggle__bar {
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: #fff;
  display: block;
}

@media (min-width: 900px) {
  .header-inner {
    grid-template-columns: auto auto 1fr auto;
  }

  .nav-toggle {
    display: none;
  }

  .nav-desktop {
    display: inline-flex;
  }

  .nav-cta {
    display: inline-flex;
  }
}
</style>
