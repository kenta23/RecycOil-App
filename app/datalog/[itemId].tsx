import { View, Text } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTheme } from '@/providers/themeprovider';
import  BackButton  from '@/components/backbutton';

export default function DatalogsID () {
    const { itemId } = useLocalSearchParams();
    const theme = useTheme();


  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ backgroundColor: theme?.colors.background }}
        className="items-center justify-center w-full h-full min-h-screen"
      >
        <Stack.Screen
          name="datalog/[itemId]"
          options={{
            headerShown: true,
            title: `${itemId}`,
            headerTitleAlign: "center",
            headerTintColor: "#00000",
            headerStyle: { 
               backgroundColor: '#C8EDA3'
            },
            headerLeft: () => <BackButton />,
            headerBackButtonDisplayMode: "minimal",
          }}
        />

        <Text>Update the title</Text>
        <Text>fsdfsdjfsdfj</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}