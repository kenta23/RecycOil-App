import { View, Text, ScrollView, Pressable, Platform } from 'react-native'
import React from 'react'
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons'
import { PieChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/app/providers/themeprovider';
import { Image } from 'expo-image';
import TankChart from './container';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { version } from 'canvaskit-wasm/package.json';
import SkiaComponent from '@/skia components/tank-container';
import DashboardWeb from './dashboard-web';
import DashboardNative from './dashboard-native';


export default function Viewdashboard() {
  //max value is 5 liters
  //measure the volume based on the sensor
  
  //sample data
  const oilVolume = 4 * 20; 
  const maxVolume = 5 * 20;
  const remainingVolume = maxVolume - oilVolume; // 1.5 liters


  const pieData = [
    { value: oilVolume, color: '#DB2777', },
    { value: remainingVolume, color: 'lightgray', },
   
  ];


  return Platform.OS === "web" ? <DashboardWeb pieData={pieData} /> : <DashboardNative pieData={pieData}/>
}