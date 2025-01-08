import { View, Text, StyleSheet } from 'react-native';
import { Canvas, Path, Rect } from '@shopify/react-native-skia';
import { WindArrowDown } from 'lucide-react';

export default function TankChart ({ value, maxValue, color, width, height }: { value: number; maxValue: number, color: string, width: number, height: number }) {

  const capHeight = 10; // Height of the tank cap
  const tankHeight = height;
  const tankWidth = width;
  const fillHeight = (value / maxValue) * tankHeight; // Dynamic fill height

  return (
    <View style={{
       width: tankWidth + 20,
       height: tankHeight,
    }}>
      {/* Skia Canvas */}
      <Canvas style={{ width: '100%', height: '100%', marginHorizontal: 'auto' }}>
        {/* Tank Cap */}
        <Rect
          x={-20}
          y={10}
          width={tankWidth + 40}
          height={capHeight}
          color={value === 5 ? "#78B544" : "#D3D3D3"} // Light gray for cap
        />

        {/* Tank Shape */}
        <Rect
          width={tankWidth}
          height={tankHeight}
          color="#D3D3D3" // Tank border color
          style="fill"
          strokeWidth={1}
          y={capHeight + 10}
          x={10}
        />

        {/* Tank Fill */}
        <Rect
          y={tankHeight - fillHeight + 20 } // Adjust to account for the tank cap
          width={tankWidth}
          style={'fill'}
          height={fillHeight}
          color={color} // Green fill color
          x={10}
        />
      </Canvas>

      {/* React Native Text */}
      <Text style={[styles.text, { top: (tankHeight - fillHeight / 2), left: tankWidth / 2 - 20 }]}>
        {`${value} Liters`}
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
    wordWrap: 'wrap',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

