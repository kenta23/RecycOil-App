import { View, Text, StyleSheet } from 'react-native';
import { Canvas, Path, Rect } from '@shopify/react-native-skia';

export default function TankChart ({ value, maxValue }: { value: number; maxValue: number }) {

  const capHeight = 10; // Height of the tank cap
  const tankHeight = 250;
  const tankWidth = 140;
  const fillHeight = (value / maxValue) * tankHeight; // Dynamic fill height

  return (
    <View>
      {/* Skia Canvas */}
      <Canvas style={{ width: 160, height: tankHeight, marginHorizontal: 'auto' }}>
        {/* Tank Cap */}
        <Rect
          x={-20}
          y={10}
          width={180}
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
          color="#78B544" // Green fill color
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

