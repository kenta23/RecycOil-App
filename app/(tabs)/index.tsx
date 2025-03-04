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
    <View className="w-full h-full min-h-screen pt-2 pb-4" style={{ backgroundColor: theme?.colors.background }}>
       <Viewdashboard />
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
