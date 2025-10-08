<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineEmits<{
  (e: 'toggle-drawer'): void
}>()

const route = useRoute()

const links = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
  { label: 'Admin', to: '/admin' },
]

const currentPath = computed(() => route.path)

const isActive = (path: string) =>
  currentPath.value === path || currentPath.value.startsWith(`${path}/`)
</script>

<template>
  <v-app-bar color="primary" flat>
    <v-app-bar-nav-icon class="d-lg-none" icon="mdi-menu" @click="$emit('toggle-drawer')" />
    <v-toolbar-title class="font-weight-bold text-white">
      Nail Atelier
    </v-toolbar-title>
    <v-spacer />
    <div class="d-none d-lg-flex ga-2">
      <v-btn
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :variant="isActive(link.to) ? 'flat' : 'text'"
        color="white"
        class="text-white text-capitalize"
      >
        {{ link.label }}
      </v-btn>
      <v-btn to="/checkout" color="accent" class="text-none text-primary" variant="flat">
        Demo Checkout
      </v-btn>
    </div>
  </v-app-bar>
</template>
