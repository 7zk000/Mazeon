# 画像アセット

このディレクトリには、ゲームで使用する画像ファイルを格納します。

## ディレクトリ構造

```
images/
├── ui/                    # UI関連の画像
│   ├── buttons/          # ボタン画像
│   ├── icons/            # アイコン画像
│   ├── backgrounds/      # 背景画像
│   └── logos/            # ロゴ画像
├── game/                  # ゲーム関連の画像
│   ├── characters/       # キャラクター画像
│   ├── items/            # アイテム画像
│   ├── tiles/            # タイル画像
│   └── effects/          # エフェクト画像
└── README.md             # このファイル
```

## 画像ファイルの命名規則

### 基本規則
- ファイル名は小文字とハイフンを使用
- 拡張子は `.png` または `.jpg` を使用
- 解像度は必要に応じて複数バージョンを用意

### 命名例
```
player-idle.png          # プレイヤー待機状態
player-walk-1.png        # プレイヤー歩行アニメーション1
player-walk-2.png        # プレイヤー歩行アニメーション2
key-gold.png             # 金色の鍵
wall-stone.png           # 石の壁
button-start.png         # スタートボタン
icon-settings.png        # 設定アイコン
```

## 推奨画像サイズ

### UI画像
- ボタン: 200x80px
- アイコン: 64x64px
- ロゴ: 256x256px
- 背景: 1920x1080px

### ゲーム画像
- キャラクター: 64x64px
- アイテム: 32x32px
- タイル: 64x64px
- エフェクト: 128x128px

## 画像最適化

### ファイルサイズ
- PNG: 透明背景が必要な場合
- JPG: 写真やグラデーションの場合
- ファイルサイズは1MB以下を推奨

### 圧縮
- PNG: PNGQuant を使用して圧縮
- JPG: 品質80-90%で保存

## 使用例

```javascript
// 画像の読み込み
const playerImage = require('./images/game/characters/player-idle.png');
const keyImage = require('./images/game/items/key-gold.png');

// React Nativeでの使用
<Image source={playerImage} style={styles.player} />
<Image source={keyImage} style={styles.item} />
```

## 注意事項

1. **著作権**: 使用する画像の著作権を確認してください
2. **ライセンス**: 商用利用可能な画像を使用してください
3. **一貫性**: ゲーム全体で統一されたスタイルを使用してください
4. **パフォーマンス**: 必要以上に大きな画像は避けてください
5. **バックアップ**: オリジナルファイルは別途保存してください

## 推奨リソース

### 無料画像サイト
- [OpenGameArt](https://opengameart.org/)
- [Kenney](https://kenney.nl/)
- [Itch.io](https://itch.io/game-assets/free)

### 画像編集ツール
- [GIMP](https://www.gimp.org/) (無料)
- [Inkscape](https://inkscape.org/) (ベクター画像)
- [Piskel](https://www.piskelapp.com/) (ピクセルアート)

### 画像最適化ツール
- [TinyPNG](https://tinypng.com/)
- [ImageOptim](https://imageoptim.com/)
- [PNGQuant](https://pngquant.org/)
