<template>
  <section class="section">
    <div class="container not-found">
      <div class="icon">:(</div>
      <h1>ページが見つかりません</h1>
      <p>リンクが変更されたか、削除された可能性があります。</p>
      <RouterLink to="/" class="btn btn-primary">ホームに戻る</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  text-align: center;
  display: grid;
  gap: 1.5rem;
  justify-items: center;
}

.icon {
  font-size: 4rem;
  color: var(--color-secondary);
}

h1 {
  margin: 0;
  font-size: 2.2rem;
  color: var(--color-secondary);
}

p {
  margin: 0;
  color: var(--color-muted);
}

.btn {
  margin-top: 1rem;
}
</style>
