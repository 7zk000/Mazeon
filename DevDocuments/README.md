# DevDocuments インデックス

開発関連ドキュメントの索引です。更新時は重複を避け、既存ドキュメントを参照する運用に従ってください。

## 文書一覧
- `注意点.md`: ReactNativeゲーム開発の“絶対遵守”チェックリスト。最優先で参照
- `AI_UPDATE_RULES.md`: AI/人間による更新ルールと参照ポリシー
- `概要.md`: 詳細な開発ドキュメント（存在する場合）。セットアップ/構造/手順/トラブルシュート

## 参照順序（重複防止）
1) `注意点.md`
2) `AI_UPDATE_RULES.md`
3) `dev.md`（存在する場合）
4) プロジェクトルートの `README.md` と `setup.md`

## 関連コードの参照ポイント
- 設定: `src/config/GameConfig.js`
- 定数: `src/constants/GameConstants.js`
- 共通関数: `src/utils/GameUtils.js`
- サービス: `src/services/*`
- フック: `src/hooks/*`
- バックエンド: `backend/server.js`

## 更新手順（要約）
1. 既存の設定/定数/共通関数を再利用できないか確認
2. 仕様変更は `注意点.md` と `AI_UPDATE_RULES.md` を更新
3. 詳細は（存在する場合）`dev.md` に追記
4. PR/コミットに理由・影響・参照先を明記

本READMEはドキュメント間の重複と齟齬を防ぐためのガイドです。