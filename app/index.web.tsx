import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

export default function home() {
  const router = useRouter();
  return (
    <View>
      <Text>home</Text>
      <Pressable onPress={() => router.push('/(tabs)/dashboard')} >
           <Text>Click to go dashboard</Text>
      </Pressable>
    </View>
  )
}