<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <h2>Nail Atelier</h2>
        <p>
          Vue 3 + Pinia + SCSS で仕上げたネイルチップECデモ。クリエイター作品のカタログと購入体験を短期間で実装できます。
        </p>
      </div>
      <div>
        <h3>リソース</h3>
        <ul class="footer-list">
          <li><RouterLink to="/search">検索ページ</RouterLink></li>
          <li><RouterLink to="/admin">管理者コンソール</RouterLink></li>
        </ul>
      </div>
      <div>
        <h3>コンタクト</h3>
        <p class="mb-2">demo@nailatelier.dev</p>
        <p class="mb-0">© {{ new Date().getFullYear() }} Nail Atelier</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  background: var(--color-secondary);
  color: #f5efff;
  padding: 3.5rem 0;
  margin-top: 4rem;
}

.footer-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: start;
}

.footer-brand h2 {
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
  letter-spacing: 0.04em;
}

.footer-brand p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.82);
}

h3 {
  margin: 0 0 0.8rem;
  font-size: 1.05rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.4rem;
}

.footer-list a {
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.95rem;
}

.footer-list a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .app-footer {
    padding: 3rem 0;
  }
}
</style>
