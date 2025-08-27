import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';

// 迷路描画（Skia使用）。Skia未導入でも安全に読み込めるよう動的requireにします。
const SkiaMazeView = ({ maze, playerPosition, exitOpen, viewport = 41 }) => {
  const skia = useMemo(() => {
    try {
      // 動的ロード（未導入でもクラッシュしない）
      return require('@shopify/react-native-skia');
    } catch (e) {
      return null;
    }
  }, []);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (!maze || !skia) {
    return null; // Skiaが無い場合は何も描画しない（親側でフォールバック）
  }

  const { Canvas, Rect, Group, useFont, useImage, Paint, Path } = skia;

  const level = playerPosition?.level || 0;
  const levelMaze = maze[level];
  const half = Math.floor(viewport / 2);
  const startY = Math.max(0, playerPosition.y - half);
  const endY = Math.min(levelMaze.length - 1, playerPosition.y + half);
  const startX = Math.max(0, playerPosition.x - half);
  const endX = Math.min(levelMaze[0].length - 1, playerPosition.x + half);

  const width = endX - startX + 1;
  const height = endY - startY + 1;

  // キャンバスサイズは親Viewのstyleに依存。セルサイズは自動で調整
  const CELL = 14; // ベースセルサイズ（スケール前）

  const onPan = useCallback((e) => {
    const { translationX, translationY, state } = e.nativeEvent;
    if (state === 2 /* active */ || state === 4 /* end */) {
      setOffset((prev) => ({ x: prev.x + translationX, y: prev.y + translationY }));
    }
  }, []);

  const onPinch = useCallback((e) => {
    const { scale: s, state } = e.nativeEvent;
    if (state === 2 /* active */ || state === 4 /* end */) {
      setScale((prev) => {
        const next = Math.max(0.5, Math.min(3, prev * s));
        return next;
      });
    }
  }, []);

  return (
    <PinchGestureHandler onGestureEvent={onPinch}>
      <PanGestureHandler onGestureEvent={onPan}>
        <View style={styles.container}>
          <Canvas style={styles.canvas}>
            <Group transform={[{ translateX: offset.x }, { translateY: offset.y }, { scale }] }>
              {/* 背景 */}
              <Rect x={0} y={0} width={width * CELL} height={height * CELL} color="#2c3e50" />
              {
                Array.from({ length: height }).map((_, iy) => (
                  Array.from({ length: width }).map((__, ix) => {
                    const x = startX + ix;
                    const y = startY + iy;
                    const cell = levelMaze[y][x];
                    const px = ix * CELL;
                    const py = iy * CELL;
                    const isPlayer = (playerPosition.x === x && playerPosition.y === y);
                    const hasExit = cell.hasExit;
                    const hasKey = cell.hasKey;

                    // セル本体
                    return (
                      <Group key={`${x}-${y}`}>
                        <Rect x={px} y={py} width={CELL} height={CELL} color={isPlayer ? '#3498db' : '#34495e'} />
                        {/* 壁線（薄描画） */}
                        {cell.walls.north && <Rect x={px} y={py} width={CELL} height={1} color="#ecf0f1" />}
                        {cell.walls.south && <Rect x={px} y={py + CELL - 1} width={CELL} height={1} color="#ecf0f1" />}
                        {cell.walls.west && <Rect x={px} y={py} width={1} height={CELL} color="#ecf0f1" />}
                        {cell.walls.east && <Rect x={px + CELL - 1} y={py} width={1} height={CELL} color="#ecf0f1" />}
                        {/* キー/出口アイコンの簡易表現 */}
                        {hasKey && <Rect x={px + CELL/3} y={py + CELL/3} width={CELL/3} height={CELL/3} color="#f39c12" />}
                        {hasExit && exitOpen && <Rect x={px + CELL/3} y={py + CELL/3} width={CELL/3} height={CELL/3} color="#27ae60" />}
                        {hasExit && !exitOpen && <Rect x={px + CELL/3} y={py + CELL/3} width={CELL/3} height={CELL/3} color="#7f8c8d" />}
                      </Group>
                    );
                  })
                ))
              }
            </Group>
          </Canvas>
        </View>
      </PanGestureHandler>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});

export default SkiaMazeView;
