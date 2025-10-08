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
  { icon: 'mdi-home', label: 'Home', to: '/' },
  { icon: 'mdi-magnify', label: 'Search', to: '/search' },
  { icon: 'mdi-clipboard-text', label: 'Admin', to: '/admin' },
  { icon: 'mdi-cart-heart', label: 'Checkout', to: '/checkout' },
]

const handleNavigate = async (path: string) => {
  await router.push(path)
  emit('update:open', false)
  emit('navigate')
}
</script>

<template>
  <v-navigation-drawer
    :model-value="props.open"
    location="left"
    temporary
    class="d-lg-none"
    @update:model-value="emit('update:open', $event)"
  >
    <v-list nav>
      <v-list-item
        v-for="link in links"
        :key="link.to"
        :prepend-icon="link.icon"
        :title="link.label"
        @click="handleNavigate(link.to)"
      />
    </v-list>
  </v-navigation-drawer>
</template>
