import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { GameConfig } from '../config/GameConfig';
import { scaledSize } from '../utils/GameUtils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * ゲームボタンコンポーネント
 */
export const GameButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false,
  variant = 'primary' // 'primary', 'secondary', 'danger', 'success'
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`buttonText_${variant}`],
    disabled && styles.buttonText_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

/**
 * ゲームカードコンポーネント
 */
export const GameCard = ({ 
  children, 
  style, 
  padding = 'md',
  shadow = true 
}) => {
  const cardStyles = [
    styles.card,
    styles[`card_padding_${padding}`],
    shadow && styles.card_shadow,
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

/**
 * ゲームアイコンコンポーネント
 */
export const GameIcon = ({ 
  symbol, 
  size = 24, 
  color = GameConfig.ui.colors.text,
  style 
}) => {
  const iconStyles = [
    styles.icon,
    {
      fontSize: scaledSize(size),
      color,
    },
    style,
  ];

  return <Text style={iconStyles}>{symbol}</Text>;
};

/**
 * ゲームラベルコンポーネント
 */
export const GameLabel = ({ 
  text, 
  variant = 'body', // 'title', 'subtitle', 'body', 'caption'
  color = GameConfig.ui.colors.text,
  style,
  numberOfLines 
}) => {
  const labelStyles = [
    styles.label,
    styles[`label_${variant}`],
    { color },
    style,
  ];

  return (
    <Text style={labelStyles} numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
};

/**
 * ゲームバッジコンポーネント
 */
export const GameBadge = ({ 
  text, 
  variant = 'info', // 'info', 'success', 'warning', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  style 
}) => {
  const badgeStyles = [
    styles.badge,
    styles[`badge_${variant}`],
    styles[`badge_${size}`],
    style,
  ];

  const textStyles = [
    styles.badgeText,
    styles[`badgeText_${variant}`],
    styles[`badgeText_${size}`],
  ];

  return (
    <View style={badgeStyles}>
      <Text style={textStyles}>{text}</Text>
    </View>
  );
};

/**
 * ゲームプログレスバーコンポーネント
 */
export const GameProgressBar = ({ 
  progress, // 0-1
  height = 8,
  backgroundColor = GameConfig.ui.colors.dark,
  progressColor = GameConfig.ui.colors.primary,
  style 
}) => {
  const progressBarStyles = [
    styles.progressBar,
    {
      height: scaledSize(height),
      backgroundColor,
    },
    style,
  ];

  const progressStyles = [
    styles.progressBar_fill,
    {
      width: `${Math.max(0, Math.min(100, progress * 100))}%`,
      backgroundColor: progressColor,
    },
  ];

  return (
    <View style={progressBarStyles}>
      <View style={progressStyles} />
    </View>
  );
};

/**
 * ゲームスコア表示コンポーネント
 */
export const GameScore = ({ 
  score, 
  label = 'Score',
  variant = 'large', // 'small', 'medium', 'large'
  style 
}) => {
  const containerStyles = [
    styles.scoreContainer,
    styles[`scoreContainer_${variant}`],
    style,
  ];

  return (
    <View style={containerStyles}>
      <GameLabel text={label} variant="caption" />
      <GameLabel text={score.toString()} variant="title" />
    </View>
  );
};

/**
 * ゲームタイマーコンポーネント
 */
export const GameTimer = ({ 
  time, // ミリ秒
  variant = 'large', // 'small', 'medium', 'large'
  showLabel = true,
  style 
}) => {
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const containerStyles = [
    styles.timerContainer,
    styles[`timerContainer_${variant}`],
    style,
  ];

  return (
    <View style={containerStyles}>
      {showLabel && <GameLabel text="Time" variant="caption" />}
      <GameLabel text={formatTime(time)} variant="title" />
    </View>
  );
};

/**
 * ゲームグリッドコンポーネント
 */
export const GameGrid = ({ 
  children, 
  columns = 1,
  spacing = GameConfig.ui.spacing.md,
  style 
}) => {
  const gridStyles = [
    styles.grid,
    {
      gap: scaledSize(spacing),
    },
    style,
  ];

  return <View style={gridStyles}>{children}</View>;
};

/**
 * ゲームセパレーターコンポーネント
 */
export const GameSeparator = ({ 
  height = 1,
  color = GameConfig.ui.colors.dark,
  margin = GameConfig.ui.spacing.md,
  style 
}) => {
  const separatorStyles = [
    styles.separator,
    {
      height: scaledSize(height),
      backgroundColor: color,
      marginVertical: scaledSize(margin),
    },
    style,
  ];

  return <View style={separatorStyles} />;
};

/**
 * ゲームローディングコンポーネント
 */
export const GameLoading = ({ 
  text = 'Loading...',
  size = 'medium', // 'small', 'medium', 'large'
  style 
}) => {
  const containerStyles = [
    styles.loadingContainer,
    styles[`loadingContainer_${size}`],
    style,
  ];

  return (
    <View style={containerStyles}>
      <GameIcon symbol="⏳" size={24} />
      <GameLabel text={text} variant="body" style={styles.loadingText} />
    </View>
  );
};

// スタイル定義
const styles = StyleSheet.create({
  // ボタンスタイル
  button: {
    paddingVertical: scaledSize(12),
    paddingHorizontal: scaledSize(24),
    borderRadius: scaledSize(8),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scaledSize(44),
  },
  button_primary: {
    backgroundColor: GameConfig.ui.colors.primary,
  },
  button_secondary: {
    backgroundColor: GameConfig.ui.colors.secondary,
  },
  button_danger: {
    backgroundColor: GameConfig.ui.colors.danger,
  },
  button_success: {
    backgroundColor: GameConfig.ui.colors.success,
  },
  button_disabled: {
    backgroundColor: GameConfig.ui.colors.dark,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: scaledSize(16),
    fontWeight: '600',
    color: GameConfig.ui.colors.text,
  },
  buttonText_primary: {
    color: GameConfig.ui.colors.text,
  },
  buttonText_secondary: {
    color: GameConfig.ui.colors.text,
  },
  buttonText_danger: {
    color: GameConfig.ui.colors.text,
  },
  buttonText_success: {
    color: GameConfig.ui.colors.text,
  },
  buttonText_disabled: {
    color: GameConfig.ui.colors.textSecondary,
  },

  // カードスタイル
  card: {
    backgroundColor: GameConfig.ui.colors.background,
    borderRadius: scaledSize(12),
  },
  card_padding_sm: {
    padding: scaledSize(GameConfig.ui.spacing.sm),
  },
  card_padding_md: {
    padding: scaledSize(GameConfig.ui.spacing.md),
  },
  card_padding_lg: {
    padding: scaledSize(GameConfig.ui.spacing.lg),
  },
  card_shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // アイコンスタイル
  icon: {
    textAlign: 'center',
  },

  // ラベルスタイル
  label: {
    color: GameConfig.ui.colors.text,
  },
  label_title: {
    fontSize: scaledSize(24),
    fontWeight: 'bold',
  },
  label_subtitle: {
    fontSize: scaledSize(18),
    fontWeight: '600',
  },
  label_body: {
    fontSize: scaledSize(16),
    fontWeight: 'normal',
  },
  label_caption: {
    fontSize: scaledSize(14),
    fontWeight: 'normal',
  },

  // バッジスタイル
  badge: {
    borderRadius: scaledSize(12),
    paddingHorizontal: scaledSize(8),
    paddingVertical: scaledSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge_info: {
    backgroundColor: GameConfig.ui.colors.info,
  },
  badge_success: {
    backgroundColor: GameConfig.ui.colors.success,
  },
  badge_warning: {
    backgroundColor: GameConfig.ui.colors.warning,
  },
  badge_danger: {
    backgroundColor: GameConfig.ui.colors.danger,
  },
  badge_sm: {
    paddingHorizontal: scaledSize(6),
    paddingVertical: scaledSize(2),
  },
  badge_md: {
    paddingHorizontal: scaledSize(8),
    paddingVertical: scaledSize(4),
  },
  badge_lg: {
    paddingHorizontal: scaledSize(12),
    paddingVertical: scaledSize(6),
  },
  badgeText: {
    color: GameConfig.ui.colors.text,
    fontWeight: '600',
  },
  badgeText_info: {
    color: GameConfig.ui.colors.text,
  },
  badgeText_success: {
    color: GameConfig.ui.colors.text,
  },
  badgeText_warning: {
    color: GameConfig.ui.colors.text,
  },
  badgeText_danger: {
    color: GameConfig.ui.colors.text,
  },
  badgeText_sm: {
    fontSize: scaledSize(10),
  },
  badgeText_md: {
    fontSize: scaledSize(12),
  },
  badgeText_lg: {
    fontSize: scaledSize(14),
  },

  // プログレスバースタイル
  progressBar: {
    borderRadius: scaledSize(4),
    overflow: 'hidden',
  },
  progressBar_fill: {
    height: '100%',
    borderRadius: scaledSize(4),
  },

  // スコアスタイル
  scoreContainer: {
    alignItems: 'center',
  },
  scoreContainer_small: {
    padding: scaledSize(GameConfig.ui.spacing.sm),
  },
  scoreContainer_medium: {
    padding: scaledSize(GameConfig.ui.spacing.md),
  },
  scoreContainer_large: {
    padding: scaledSize(GameConfig.ui.spacing.lg),
  },

  // タイマースタイル
  timerContainer: {
    alignItems: 'center',
  },
  timerContainer_small: {
    padding: scaledSize(GameConfig.ui.spacing.sm),
  },
  timerContainer_medium: {
    padding: scaledSize(GameConfig.ui.spacing.md),
  },
  timerContainer_large: {
    padding: scaledSize(GameConfig.ui.spacing.lg),
  },

  // グリッドスタイル
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // セパレータースタイル
  separator: {
    width: '100%',
  },

  // ローディングスタイル
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaledSize(GameConfig.ui.spacing.lg),
  },
  loadingContainer_small: {
    padding: scaledSize(GameConfig.ui.spacing.sm),
  },
  loadingContainer_medium: {
    padding: scaledSize(GameConfig.ui.spacing.md),
  },
  loadingContainer_large: {
    padding: scaledSize(GameConfig.ui.spacing.xl),
  },
  loadingText: {
    marginTop: scaledSize(GameConfig.ui.spacing.sm),
  },
});
