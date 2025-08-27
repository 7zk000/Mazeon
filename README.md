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

## プロジェクト構造
```
mazeon/
├── src/                    # ReactNativeアプリのソースコード
│   ├── screens/           # 画面コンポーネント
│   └── context/           # React Context
├── backend/               # Node.jsバックエンド
├── package.json          # フロントエンド依存関係
└── setup.md              # セットアップガイド
```

## ライセンス
MIT License