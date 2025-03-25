import { View, } from 'react-native'
import React, { useState } from 'react'
import Viewdashboard from '@/components/viewdashboard';
import { useTheme } from '../../providers/themeprovider';



export default function Dashboard() {
  const theme = useTheme();

  
  return (
    <View className="w-full h-full min-h-screen pt-2 pb-4" style={{ backgroundColor: theme?.colors.background }}>
       <Viewdashboard />
    </View>
  );
}

