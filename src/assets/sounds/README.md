# 音声アセット

このディレクトリには、ゲームで使用する音声ファイルを格納します。

## ディレクトリ構造

```
sounds/
├── sfx/                   # 効果音
│   ├── ui/               # UI効果音
│   ├── game/             # ゲーム効果音
│   └── ambient/          # 環境音
├── music/                 # 音楽
│   ├── menu/             # メニュー音楽
│   ├── game/             # ゲーム音楽
│   └── victory/          # 勝利音楽
└── README.md             # このファイル
```

## 音声ファイルの命名規則

### 基本規則
- ファイル名は小文字とハイフンを使用
- 拡張子は `.mp3` または `.wav` を使用
- ファイルサイズは適切に圧縮

### 命名例
```
button-click.mp3          # ボタンクリック音
player-move.wav           # プレイヤー移動音
item-collect.mp3          # アイテム取得音
game-win.mp3              # ゲーム勝利音
menu-background.mp3       # メニュー背景音楽
game-ambient.mp3          # ゲーム環境音楽
```

## 推奨音声仕様

### 効果音 (SFX)
- **フォーマット**: MP3 または WAV
- **サンプリングレート**: 44.1kHz
- **ビット深度**: 16bit
- **チャンネル**: モノラル（ステレオでも可）
- **長さ**: 0.1秒 - 3秒
- **ファイルサイズ**: 100KB以下

### 音楽 (Music)
- **フォーマット**: MP3
- **サンプリングレート**: 44.1kHz
- **ビット深度**: 16bit
- **チャンネル**: ステレオ
- **長さ**: 30秒 - 3分（ループ用）
- **ファイルサイズ**: 5MB以下

## 音声最適化

### 圧縮設定
- **MP3**: 128kbps（音楽）、64kbps（効果音）
- **WAV**: 無圧縮（高品質が必要な場合）

### 品質チェック
- ノイズの除去
- 適切な音量レベル（-12dB to -6dB）
- フェードイン/アウトの適用

## 使用例

```javascript
// react-native-soundでの使用
import Sound from 'react-native-sound';

// 効果音の読み込み
const buttonSound = new Sound('button-click.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Failed to load sound', error);
  } else {
    console.log('Sound loaded successfully');
  }
});

// 効果音の再生
buttonSound.play((success) => {
  if (success) {
    console.log('Sound played successfully');
  } else {
    console.log('Sound playback failed');
  }
});
```

## 音声ファイル一覧

### UI効果音
- `button-click.mp3` - ボタンクリック
- `button-hover.mp3` - ボタンホバー
- `menu-open.mp3` - メニューオープン
- `menu-close.mp3` - メニュークローズ

### ゲーム効果音
- `player-move.mp3` - プレイヤー移動
- `item-collect.mp3` - アイテム取得
- `key-collect.mp3` - 鍵取得
- `door-open.mp3` - ドアオープン
- `level-complete.mp3` - レベルクリア
- `game-win.mp3` - ゲーム勝利
- `game-lose.mp3` - ゲーム失敗

### 環境音
- `ambient-cave.mp3` - 洞窟環境音
- `wind-light.mp3` - 軽い風の音
- `water-drip.mp3` - 水滴の音

### 音楽
- `menu-background.mp3` - メニュー背景音楽
- `game-background.mp3` - ゲーム背景音楽
- `victory-fanfare.mp3` - 勝利ファンファーレ
- `game-over.mp3` - ゲームオーバー音楽

## 注意事項

1. **著作権**: 使用する音声の著作権を確認してください
2. **ライセンス**: 商用利用可能な音声を使用してください
3. **ファイルサイズ**: アプリのサイズを考慮して適切に圧縮してください
4. **品質**: ゲームの雰囲気に合った音声を選択してください
5. **一貫性**: ゲーム全体で統一された音声スタイルを使用してください

## 推奨リソース

### 無料音声サイト
- [Freesound](https://freesound.org/)
- [OpenGameArt](https://opengameart.org/)
- [Zapsplat](https://www.zapsplat.com/) (無料プランあり)
- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/)

### 音声編集ツール
- [Audacity](https://www.audacityteam.org/) (無料)
- [GarageBand](https://www.apple.com/garageband/) (Mac)
- [Reaper](https://www.reaper.fm/) (評価版)

### 音声最適化ツール
- [FFmpeg](https://ffmpeg.org/)
- [SoX](http://sox.sourceforge.net/)
- [LAME](http://lame.sourceforge.net/) (MP3エンコーダー)

## 音声実装のベストプラクティス

### パフォーマンス
- 音声ファイルは事前に読み込み
- 使用後は適切にリリース
- 同時再生数を制限

### ユーザビリティ
- 音量設定を提供
- 音声のON/OFF切り替え
- アクセシビリティを考慮

### デバッグ
- 音声の読み込みエラーをログ出力
- 再生失敗時のフォールバック
- デバッグモードでの音声情報表示
