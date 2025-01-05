import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable, Dimensions, Switch } from 'react-native'
import React, { useState } from 'react'
import Viewdashboard from '@/components/viewdashboard';
import { useAuth } from '@/providers/authprovider';
import { useTheme } from '../../providers/themeprovider';
import { Redirect } from 'expo-router';
import { useRouter } from 'expo-router';

const pieData = [
  {value: 54, color: '#177AD5', text: '54%'},
  {value: 30, color: '#79D2DE', text: '30%'},
  {value: 26, color: '#ED6665', text: '26%'},
  ];

export default function Dashboard() {
  const [power, setPower] = useState<boolean>(false);
  const theme = useTheme();
  const router = useRouter();
  const { session } = useAuth();

  
  return (
    <View style={{ backgroundColor: theme?.colors.background }}>
      {power ? (
        <Viewdashboard />
      ) : (
        <View style={{ backgroundColor: theme?.colors.background }} className="flex items-center justify-center w-full h-full min-h-screen">
          <View style={styles.container}>
            <Text
              style={
                { color: theme?.colors.text, fontSize: 20 }
              }
            >
              The Machine is turned off
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={power ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setPower((previousState) => !previousState)}
              value={power}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  textDescription: {
    color: "#68665F",
    fontSize: 20,
  },
  textDescriptionDark: {
    color: "#ffff",
    fontSize: 20,
  },
});
