import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import React from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'

export default function RenderTankOnWeb ({ biodiesel }: { biodiesel: number }) {

  return (
    Platform.OS === "web" && (
      <WithSkiaWeb
        fallback={
          <View>
            <ActivityIndicator color={"#78B544"} />
          </View>
        }
        getComponent={() => import("@/components/container")}
        componentProps={{
          value: biodiesel,
          maxValue: 5,
          color: "#78B544",
          width: 190,
          height: 300,
        }}
      />
    )
  );
}
