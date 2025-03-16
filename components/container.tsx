import { View, Text, StyleSheet } from 'react-native';
import { Canvas, Path, Rect } from '@shopify/react-native-skia';
import { WindArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import React from 'react';
import { useButtonStart } from '@/lib/store';

function TankChart ({ value, maxValue, color, width, height }: { value: number; maxValue: number, color: string, width: number, height: number }) {

  const capHeight = 10; // Height of the tank cap
  const tankHeight = height;
  const tankWidth = width;
  const fillHeight = (value / maxValue) * tankHeight - 40; // Dynamic fill height
  const { buttonStart } = useButtonStart();
 

  function displayLabel(value: number) {
    if (buttonStart) {
        if(value === 0) { 
          return `Mixing oil...`;
        }
        else  { 
          return `${value} Liters`;
        }
    }
    else  {
      return `No data`;
    }
  }

    return (
    <View
      style={{
        width: tankWidth + 20,
        height: 'auto',
        position: 'relative',
      }}
    >
      {/* Skia Canvas */}
      <Canvas
        style={{ width: "100%", height, marginHorizontal: "auto", }}
      >
        {/* Tank Cap */}
        <Rect
          x={-20}
          y={10}
          width={tankWidth + 40}
          height={capHeight}
          color={value === 6 ? "#78B544" : "#D3D3D3"}
        />

        {/* Tank Shape */}
        <Rect
          width={tankWidth}
          height={tankHeight}
          color="#D3D3D3"
          style="fill"
          strokeWidth={1}
          y={capHeight + 10}
          x={10}
        />

        {/* Tank Fill */}
        <Rect
          y={tankHeight - fillHeight + 20}
          width={tankWidth}
          style={"fill"}
          height={fillHeight}
          color={color}
          x={10}
        />
      </Canvas>

      {/* React Native Text */}
      <Text
        style={styles.text}
      >
         {displayLabel(value)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    position: 'absolute',
    fontSize: 14,
    top: '50%',
    left: 'auto',
    width: '100%',
    wordWrap: 'wrap',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default React.memo(TankChart);