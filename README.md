# Mazeon

協力型迷路攻略ゲーム

## 概要
Mazeonは、ReactNativeとNode.jsを使用した協力型迷路攻略ゲームです。プレイヤーは迷路内で鍵を探し、制限時間内に出口を目指します。

## 機能
- プレイ人数: 1人〜8人
- 迷路は自動生成
- 階層がある(1〜3階層まで)
- アイテム(脱出用鍵や攻略の手助けがされるもの)
- 1プレイ　15分

## 技術スタック
- **フロントエンド**: React Native 0.72.6
- **バックエンド**: Node.js + Express + Socket.IO
- **状態管理**: React Context API
- **ナビゲーション**: React Navigation

## セットアップ
詳細なセットアップ手順は [setup.md](./setup.md) を参照してください。

### クイックスタート
```bash
# 依存関係のインストール
npm install
cd backend && npm install

# バックエンドサーバーの起動
cd backend && npm start

# ReactNativeアプリの起動（別ターミナルで）
npm run android  # Android
npm run ios      # iOS
```

## プロジェクト構造（最新）
```
Mazeon/
├── src/                         # React Native アプリ
│   ├── App.js                   # ルート（Navigation/Providers）
│   ├── screens/                 # 画面
│   │   ├── HomeScreen.js
│   │   ├── LobbyScreen.js
│   │   └── GameScreen.js
│   ├── context/                 # グローバル状態/Socket管理
│   │   └── GameContext.js
│   ├── config/                  # ゲーム/UI/音/通信/デバッグ設定
│   │   └── GameConfig.js
│   ├── constants/               # 共有定数（状態/イベント等）
│   │   └── GameConstants.js
│   ├── utils/                   # ユーティリティ（スケール/時間/ログ等）
│   │   └── GameUtils.js
│   ├── services/                # サービス（外部I/O）
│   │   ├── AudioService.js
│   │   └── StorageService.js
│   ├── hooks/                   # カスタムフック（ゲームループ等）
│   │   └── GameHooks.js
│   ├── components/              # 共通UI
│   │   └── GameComponents.js
│   └── assets/                  # アセット
│       ├── images/
│       │   └── README.md
│       └── sounds/
│           └── README.md
├── backend/                     # Node.js バックエンド
│   ├── package.json
│   ├── server.js                # Express + Socket.IO
│   ├── env.example
│   └── DevDocuments/            # 開発ドキュメント
│       ├── README.md            # 索引/参照順序
│       ├── 概要.md
│       ├── 注意点.md            # 絶対遵守ベストプラクティス
│       └── AI_UPDATE_RULES.md   # AI更新ルール/参照ポリシー
├── package.json                 # RN依存とスクリプト
├── metro.config.js
├── babel.config.js
├── index.js
├── app.json
├── .gitignore
├── README.md
└── setup.md
```

## 開発者向けドキュメント
- 最優先: `backend/DevDocuments/注意点.md`
- 更新ルール: `backend/DevDocuments/AI_UPDATE_RULES.md`
- 概要/構成: `backend/DevDocuments/概要.md`

## ライセンス
MIT License