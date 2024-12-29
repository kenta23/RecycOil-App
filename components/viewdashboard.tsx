import { View, Text, ScrollView, Pressable, Platform } from 'react-native'
import React from 'react'
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