import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Redirect, useRouter,  } from 'expo-router'

export default function home() {
  const router = useRouter();
  return <Redirect href={'/(tabs)/dashboard'}/>
}