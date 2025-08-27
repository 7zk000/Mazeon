# Mazeon セットアップガイド

## 概要
Mazeonは協力型迷路攻略ゲームです。ReactNativeでフロントエンド、Node.jsでバックエンドを構築しています。

## 必要な環境
- Node.js (v16以上)
- npm または yarn
- React Native CLI
- Android Studio (Android開発用)
- Xcode (iOS開発用、Macのみ)

## セットアップ手順

### 1. 依存関係のインストール

#### フロントエンド（ReactNative）
```bash
# プロジェクトルートで実行
npm install
```

#### バックエンド（Node.js）
```bash
# backendディレクトリで実行
cd backend
npm install
```

### 2. 環境変数の設定

#### バックエンド
```bash
cd backend
cp env.example .env
```

`.env`ファイルを編集して必要な設定を行ってください。

### 3. バックエンドサーバーの起動

```bash
cd backend
npm start
```

サーバーは http://localhost:3000 で起動します。

### 4. ReactNativeアプリの起動

#### Android
```bash
# プロジェクトルートで実行
npm run android
```

#### iOS
```bash
# プロジェクトルートで実行
npm run ios
```

### 5. 開発モードでの実行

フロントエンドとバックエンドを同時に起動する場合：
```bash
# プロジェクトルートで実行
npm run dev
```

## プロジェクト構造

```
mazeon/
├── src/                    # ReactNativeアプリのソースコード
│   ├── screens/           # 画面コンポーネント
│   │   ├── HomeScreen.js
│   │   ├── LobbyScreen.js
│   │   └── GameScreen.js
│   └── context/           # React Context
│       └── GameContext.js
├── backend/               # Node.jsバックエンド
│   ├── server.js         # メインサーバーファイル
│   ├── package.json      # バックエンド依存関係
│   └── env.example       # 環境変数サンプル
├── package.json          # フロントエンド依存関係
├── metro.config.js       # Metro bundler設定
├── babel.config.js       # Babel設定
├── index.js              # ReactNativeエントリーポイント
└── app.json              # アプリ設定
```

## ゲーム機能

### 基本ルール
- プレイ人数: 1人〜8人
- 迷路は自動生成
- 階層: 1〜3階層まで
- アイテム: 脱出用鍵や攻略の手助け
- 制限時間: 15分

### ゲームフロー
1. ホーム画面でルーム作成または参加
2. ロビーでプレイヤー待機
3. ホストがゲーム開始
4. 迷路内で鍵を探して出口を目指す
5. 制限時間内に出口に到達してクリア

## トラブルシューティング

### よくある問題

#### 1. サーバーに接続できない
- バックエンドサーバーが起動しているか確認
- ポート3000が使用可能か確認
- ファイアウォール設定を確認

#### 2. ReactNativeアプリが起動しない
- Node.jsのバージョンを確認（v16以上推奨）
- React Native CLIがインストールされているか確認
- Android Studio / Xcodeの設定を確認

#### 3. 依存関係のエラー
```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

## 開発者向け情報

### 技術スタック
- **フロントエンド**: React Native 0.72.6
- **バックエンド**: Node.js + Express + Socket.IO
- **状態管理**: React Context API
- **ナビゲーション**: React Navigation

### 追加機能の実装
- 音響効果の追加
- アニメーションの改善
- マルチプレイヤー同期の強化
- データベース連携（MongoDB等）

## ライセンス
MIT License
