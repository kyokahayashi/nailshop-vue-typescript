<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppNavigationDrawer from '@/components/layout/AppNavigationDrawer.vue'

const isDrawerOpen = ref(false)

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>

<template>
  <v-app>
    <AppHeader @toggle-drawer="toggleDrawer" />
    <AppNavigationDrawer v-model:open="isDrawerOpen" @navigate="isDrawerOpen = false" />
    <v-main>
      <RouterView />
    </v-main>
    <AppFooter />
  </v-app>
</template>
