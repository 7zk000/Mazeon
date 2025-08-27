# Mazeon 開発者ドキュメント

## プロジェクト概要
Mazeonは協力型迷路攻略ゲームです。ReactNativeでフロントエンド、Node.jsでバックエンドを構築しています。

## プロジェクト構造とファイル説明

### ルートディレクトリ
```
mazeon/
├── package.json          # ReactNativeプロジェクトの依存関係とスクリプト
├── metro.config.js       # Metro bundler設定（ReactNativeのバンドラー）
├── babel.config.js       # Babel設定（JavaScriptトランスパイラー）
├── index.js              # ReactNativeアプリのエントリーポイント
├── app.json              # アプリの基本情報（名前、表示名など）
├── .gitignore            # Git除外ファイル設定
├── README.md             # プロジェクト概要（ユーザー向け）
├── setup.md              # セットアップガイド（ユーザー向け）
├── dev.txt               # 開発者向けドキュメント（このファイル）
└── src/                  # ReactNativeアプリのソースコード
    ├── App.js            # メインAppコンポーネント
    ├── screens/          # 画面コンポーネント
    │   ├── HomeScreen.js # ホーム画面
    │   ├── LobbyScreen.js# ゲームロビー画面
    │   └── GameScreen.js # 迷路ゲーム画面
    └── context/          # React Context（状態管理）
        └── GameContext.js# ゲーム状態管理コンテキスト
```

### バックエンドディレクトリ
```
backend/
├── package.json          # Node.jsバックエンドの依存関係
├── server.js             # メインサーバーファイル（Express + Socket.IO）
└── env.example           # 環境変数サンプルファイル
```

## 各ファイルの詳細説明

### フロントエンド（ReactNative）

#### package.json
- **役割**: プロジェクトの依存関係とスクリプト定義
- **重要な設定**:
  - `dependencies`: ReactNative、ナビゲーション、Socket.IO等のライブラリ
  - `scripts`: 開発・ビルド・実行コマンド
  - `devDependencies`: 開発用ツール（Babel、ESLint等）

#### metro.config.js
- **役割**: Metro bundlerの設定
- **変更が必要な場合**: カスタムリソース（画像、フォント等）を追加する時

#### babel.config.js
- **役割**: JavaScriptのトランスパイル設定
- **重要な設定**: `react-native-reanimated/plugin`の追加

#### index.js
- **役割**: アプリのエントリーポイント
- **変更が必要な場合**: アプリ名を変更する時（app.jsonと連動）

#### app.json
- **役割**: アプリの基本情報
- **設定項目**:
  - `name`: アプリの内部名
  - `displayName`: デバイスに表示される名前

#### src/App.js
- **役割**: メインAppコンポーネント
- **機能**:
  - ナビゲーション設定
  - プロバイダーの設定
  - 画面のルーティング

#### src/context/GameContext.js
- **役割**: ゲーム状態の管理
- **重要な機能**:
  - Socket.IO接続管理
  - ゲーム状態の管理（idle, waiting, playing, finished）
  - プレイヤー位置、迷路データの管理
  - エラーハンドリング

#### src/screens/HomeScreen.js
- **役割**: アプリのホーム画面
- **機能**:
  - ルーム作成フォーム
  - ルーム参加機能
  - サーバー接続状態表示
  - ゲームルール説明

#### src/screens/LobbyScreen.js
- **役割**: ゲームロビー画面
- **機能**:
  - プレイヤー一覧表示
  - ゲーム開始ボタン（ホストのみ）
  - ルーム情報表示
  - タイマー表示

#### src/screens/GameScreen.js
- **役割**: 迷路ゲーム画面
- **機能**:
  - 迷路の描画
  - プレイヤー移動制御
  - アイテム表示（鍵、出口）
  - ゲーム状態表示

### バックエンド（Node.js）

#### backend/package.json
- **役割**: バックエンドの依存関係とスクリプト
- **重要なライブラリ**:
  - `express`: Webサーバーフレームワーク
  - `socket.io`: リアルタイム通信
  - `cors`: クロスオリジン設定
  - `helmet`: セキュリティヘッダー

#### backend/server.js
- **役割**: メインサーバーファイル
- **重要な機能**:
  - 迷路生成アルゴリズム
  - Socket.IO接続処理
  - ゲームルーム管理
  - プレイヤー移動処理
  - API エンドポイント

#### backend/env.example
- **役割**: 環境変数のサンプル
- **設定項目**:
  - `PORT`: サーバーのポート番号
  - `NODE_ENV`: 実行環境（development/production）

## 開発時の注意点

### 1. 依存関係の管理
```bash
# フロントエンドの依存関係を追加
npm install パッケージ名

# バックエンドの依存関係を追加
cd backend
npm install パッケージ名
```

### 2. 環境変数の設定
```bash
# バックエンドの環境変数を設定
cd backend
cp env.example .env
# .envファイルを編集
```

### 3. 開発サーバーの起動
```bash
# バックエンドサーバー
cd backend
npm start

# フロントエンド（別ターミナル）
npm start
```

### 4. デバッグ方法
- **フロントエンド**: React Native Debugger、Chrome DevTools
- **バックエンド**: console.log、nodemon（自動再起動）

## 機能追加・修正時のガイド

### 新しい画面を追加する場合
1. `src/screens/`に新しい画面ファイルを作成
2. `src/App.js`にナビゲーションルートを追加
3. 必要に応じて`GameContext.js`に状態を追加

### 新しいAPIエンドポイントを追加する場合
1. `backend/server.js`にルートを追加
2. 必要に応じてミドルウェアを追加
3. フロントエンドから呼び出す処理を追加

### 迷路生成アルゴリズムを変更する場合
1. `backend/server.js`の`generateMaze`関数を修正
2. 迷路の構造を変更する場合は、フロントエンドの描画処理も確認

### ゲームルールを変更する場合
1. `backend/server.js`のゲームロジックを修正
2. `src/screens/GameScreen.js`のUIを確認
3. `src/screens/HomeScreen.js`のルール説明を更新

## トラブルシューティング

### よくある問題と解決方法

#### 1. 依存関係のエラー
```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

#### 2. Metro bundlerのエラー
```bash
# Metroキャッシュをクリア
npx react-native start --reset-cache
```

#### 3. Socket.IO接続エラー
- バックエンドサーバーが起動しているか確認
- ポート番号が正しいか確認
- ファイアウォール設定を確認

#### 4. 迷路が表示されない
- 迷路データが正しく生成されているか確認
- フロントエンドの描画処理を確認
- コンソールログでデータ構造を確認

## パフォーマンス最適化

### フロントエンド
- 不要な再レンダリングを避ける
- 大きなリストにはFlatListを使用
- 画像の最適化

### バックエンド
- データベース接続のプール管理
- 適切なエラーハンドリング
- ログの適切な管理

## セキュリティ考慮事項

### フロントエンド
- 機密情報をハードコーディングしない
- 入力値の検証
- HTTPS通信の使用

### バックエンド
- 入力値の検証とサニタイゼーション
- 適切なCORS設定
- レート制限の実装
- セキュリティヘッダーの設定

## テスト

### フロントエンドテスト
```bash
npm test
```

### バックエンドテスト
```bash
cd backend
npm test
```

## デプロイ

### フロントエンド（ReactNative）
- Android: `npm run android`
- iOS: `npm run ios`

### バックエンド
- 本番環境用の環境変数を設定
- PM2等のプロセス管理ツールを使用
- ログの適切な管理

## 貢献ガイドライン

1. 機能追加時は適切なブランチを作成
2. コードレビューを実施
3. テストを追加
4. ドキュメントを更新

## ライセンス
MIT License
