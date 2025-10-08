<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/modules/cart/stores/useCartStore'

const cartStore = useCartStore()
const { items, subtotal, itemCount } = storeToRefs(cartStore)
const router = useRouter()

const updateQuantity = (productId: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  cartStore.updateQuantity(productId, value)
}

const removeItem = (productId: string) => {
  cartStore.removeItem(productId)
}

const clearCart = () => {
  cartStore.clear()
}

const goToCheckout = () => {
  if (!itemCount.value) return
  router.push({ name: 'checkout', query: { cart: '1' } })
}
</script>

<template>
  <section class="section">
    <div class="container cart-layout">
      <header class="cart-header">
        <h1>カート</h1>
        <div class="cart-summary">
          <span>商品数: {{ itemCount }} 件</span>
          <button type="button" class="btn btn-text" :disabled="!itemCount" @click="clearCart">
            カートを空にする
          </button>
        </div>
      </header>

      <div v-if="items.length" class="cart-grid">
        <article v-for="item in items" :key="item.product.id" class="card cart-item">
          <div class="cart-thumb">
            <img :src="item.product.image" :alt="item.product.title" />
          </div>
          <div class="cart-body">
            <h2>{{ item.product.title }}</h2>
            <p class="text-muted">
              {{ item.product.color }} / {{ item.product.season }} / {{ item.product.design }}
            </p>
            <p class="description">{{ item.product.description }}</p>
            <div class="cart-controls">
              <label class="field quantity-field">
                <span>数量</span>
                <input
                  :value="item.quantity"
                  type="number"
                  min="1"
                  class="number-input"
                  @input="updateQuantity(item.product.id, $event)"
                />
              </label>
              <button type="button" class="btn btn-text" @click="removeItem(item.product.id)">
                削除
              </button>
            </div>
          </div>
          <div class="cart-line-total">
            ¥{{ (item.product.price * item.quantity).toLocaleString() }}
          </div>
        </article>
      </div>

      <div v-else class="card empty-cart">
        <p class="text-muted">カートに商品がありません。カタログから追加してください。</p>
        <div class="cart-actions">
          <RouterLink to="/search" class="btn btn-secondary">カタログを検索</RouterLink>
        </div>
      </div>

      <footer v-if="items.length" class="cart-footer card">
        <div>
          <p class="text-muted text-small mb-2">小計</p>
          <p class="total">¥{{ subtotal.toLocaleString() }}</p>
        </div>
        <div class="cart-actions">
          <RouterLink to="/search" class="btn btn-text">買い物を続ける</RouterLink>
          <button type="button" class="btn btn-accent" @click="goToCheckout">
            カート内商品を購入する
          </button>
        </div>
      </footer>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cart-layout {
  display: grid;
  gap: 2rem;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.cart-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--color-secondary);
}

.cart-summary {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: var(--color-muted);
}

.cart-grid {
  display: grid;
  gap: 1.5rem;
}

.cart-item {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 200px) minmax(0, 1fr) auto;
  align-items: center;
}

.cart-thumb {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-primary-soft);
  aspect-ratio: 16 / 9;
}

.cart-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-body {
  display: grid;
  gap: 0.75rem;
}

.cart-body h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--color-secondary);
}

.cart-body .description {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.55;
}

.cart-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-field {
  max-width: 120px;
}

.cart-line-total {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.empty-cart {
  text-align: center;
  padding: 2.5rem 1.75rem;
}

.empty-cart p {
  margin: 0 0 1.5rem;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.total {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.cart-actions {
  display: flex;
  gap: 1rem;
}

@media (max-width: 900px) {
  .cart-item {
    grid-template-columns: 1fr;
  }

  .cart-line-total {
    text-align: left;
  }

  .cart-controls {
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .cart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cart-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .cart-actions {
    flex-direction: column;
  }

  .cart-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
