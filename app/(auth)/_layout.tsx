import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack screenOptions={{ }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#C8EDA3",
          },
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen 
        name="verify"
        getId={  ({ params }) => String(Date.now())}
        options={{
          headerShown: Platform.OS === "web" ? false : true,
          headerBackButtonDisplayMode: "generic",
          headerTitle: 'Verify OTP',
          headerStyle: {
          backgroundColor: "#C8EDA3",
        }}} 
      />
    </Stack>
  );
}