# Nail Atelier - ネイルチップECデモ

Vue 3 + TypeScript + Pinia + Vuetifyで構築したポートフォリオ向けネイルチップECサイトのデモアプリです。管理者は作品の登録・編集・削除ができ、購入者は色や季節で検索してデモ購入フローを体験できます。

## セットアップ

```bash
npm install
npm run dev
```

## コマンド

- `npm run dev` : Vite開発サーバーを起動
- `npm run build` : 型チェック付きで本番ビルドを作成
- `npm run preview` : ビルド成果物をローカルで確認
- `npm run lint` : ESLintでソースを検査
- `npm run format` : Prettierで主要ファイルを整形
- `npm run test:unit` : Vitestでユニットテスト実行
- `npm run test:e2e` : CypressでE2Eテスト（手動でCypress環境が必要）

## 主な技術構成

- **フロントエンド**: Vue 3 (Composition API), TypeScript, Vite
- **UI**: Vuetify 3, Material Design Icons
- **状態管理**: Pinia
- **データ取得**: Axios（JSON Server / Firebase API想定）
- **テスト**: Vitest + @vue/test-utils, Cypress（スモークテスト）

## デモデータ

`public/images` 配下にプレースホルダー画像を用意し、`src/modules/nails/data/mockNails.ts` でモック商品を管理しています。APIエンドポイント (`VITE_API_URL`) を設定するとJSON ServerやFirestoreなどに接続できます。不設定の場合はローカルストレージに保存されるモックデータで動作します。

## ライセンス

このプロジェクトは学習目的のためのサンプルです。
