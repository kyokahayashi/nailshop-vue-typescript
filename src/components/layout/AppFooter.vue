<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <v-footer color="secondary" class="text-white">
    <v-container class="py-6">
      <v-row>
        <v-col cols="12" md="6">
          <h2 class="text-h6 font-weight-bold">Nail Atelier</h2>
          <p class="text-body-2">
            Portfolio-ready nail art storefront crafted with Vue 3, Pinia, and Vuetify.
          </p>
        </v-col>
        <v-col cols="12" md="3">
          <h3 class="text-subtitle-1 font-weight-semibold mb-2">Resources</h3>
          <ul class="footer-list">
            <li><RouterLink to="/search">Search catalog</RouterLink></li>
            <li><RouterLink to="/admin">Creator admin</RouterLink></li>
          </ul>
        </v-col>
        <v-col cols="12" md="3">
          <h3 class="text-subtitle-1 font-weight-semibold mb-2">Contact</h3>
          <p class="text-body-2 mb-1">demo@nailatelier.dev</p>
          <p class="text-body-2 mb-0">© {{ new Date().getFullYear() }} Nail Atelier</p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: 0.5rem;
}

.footer-list a {
  color: inherit;
  text-decoration: none;
}

.footer-list a:hover {
  text-decoration: underline;
}
</style>
