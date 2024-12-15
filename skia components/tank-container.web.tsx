import { View, Text, StyleSheet } from 'react-native';
import { Canvas, Path, Rect } from '@shopify/react-native-skia';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type TankChart from '@/components/container'
import React from 'react';

const SkiaComponent = (
    args: React.ComponentProps<typeof TankChart>
  ) => {
    return (
      <WithSkiaWeb
        componentProps={args}
        getComponent={() => import("@/components/container")}
        fallback={<View />}
      />
    );
  };
  
export default React.memo(SkiaComponent);

