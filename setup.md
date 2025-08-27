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

## プロジェクト構造（最新）
```
Mazeon/
├── src/
│   ├── App.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── LobbyScreen.js
│   │   └── GameScreen.js
│   ├── context/
│   │   └── GameContext.js
│   ├── config/
│   │   └── GameConfig.js
│   ├── constants/
│   │   └── GameConstants.js
│   ├── utils/
│   │   └── GameUtils.js
│   ├── services/
│   │   ├── AudioService.js
│   │   └── StorageService.js
│   ├── hooks/
│   │   └── GameHooks.js
│   ├── components/
│   │   └── GameComponents.js
│   └── assets/
│       ├── images/
│       │   └── README.md
│       └── sounds/
│           └── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── env.example
│   └── DevDocuments/
│       ├── README.md
│       ├── 概要.md
│       ├── 注意点.md
│       └── AI_UPDATE_RULES.md
├── package.json
├── metro.config.js
├── babel.config.js
├── index.js
├── app.json
└── .gitignore
```

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

## 参考ドキュメント（開発者向け）
- 最優先: `backend/DevDocuments/注意点.md`
- 更新ルール: `backend/DevDocuments/AI_UPDATE_RULES.md`
- 概要/構成: `backend/DevDocuments/概要.md`

## 補足: Skia（高速描画）を使う場合
1) 依存追加: `npm i @shopify/react-native-skia`
2) iOS: `cd ios && pod install`
3) コード: `GameScreen` は `SkiaMazeView` を自動利用（Skia未導入時はフォールバック）

## ライセンス
MIT License
