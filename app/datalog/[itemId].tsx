import { View, Text, ScrollView, Alert, Modal, TextInput, Pressable } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTheme } from '@/providers/themeprovider';
import  BackButton  from '@/components/backbutton';
import { ProgressChart } from 'react-native-chart-kit';
import { progressData } from '@/lib/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SkiaComponent from '@/skia components/tank-container';



export default function DatalogsID () {
    const { itemId } = useLocalSearchParams();
    const theme = useTheme();
    const [edit, setEditing] = useState<boolean>(false);


  
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
              backgroundColor: "#C8EDA3",
            },
            headerLeft: () => <BackButton />,
            headerBackButtonDisplayMode: "minimal",
          }}
        />

           <Modal
              animationType="fade"
              accessibilityLabel="Edit"
              visible={edit}
              transparent
              onRequestClose={() => setEditing(false)}
              className="w-full h-full"
            > 
               <View className='w-full bg-black/20 h-full items-center justify-center'>
                  <View style={{ backgroundColor: theme?.colors.background }} className='shadow-gray-500 shadow-lg rounded-lg p-4 w-[20rem] min-h-[12rem]'>
                     <Text className='font-semibold text-[1.3rem]'>Edit {itemId}</Text>
                     <TextInput placeholder='title' className='border-green-400 border-[0.5px] rounded-lg p-2 mt-4' />

                     <View className='flex-row items-center justify-end gap-3 mt-6'>
                           <Pressable className='bg-[#1F9254] rounded-lg py-1 px-2 min-w-14'>
                               <Text className='text-white text-center font-semibold'>Save</Text>
                           </Pressable>

                           <Pressable onPress={() => setEditing(false)} className='rounded-lg border-[1px] border-[#dc2626] py-1 px-2 min-w-14'>
                               <Text className='text-red-600 text-center font-semibold '>Cancel</Text>
                           </Pressable>
                     </View>
                  </View>
               </View>

            </Modal>

        <ScrollView className="w-full h-screen min-h-screen">
          <View className="flex-row items-center justify-between w-full mt-10 px-4">
            {/** Name and date  */}
            <View className="flex flex-col gap-1">
              <View className="flex flex-row items-center gap-1">
                {/**title */}
                <Text
                  style={{ color: theme?.colors.text }}
                  className="text-lg font-semibold"
                >
                  fsdfgsfsdgsfg
                </Text>

                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color={theme?.colors.gray}
                  onPress={() => setEditing(true)}
                />
              </View>

              {/** format the date to mm/dd/yyyy */}
              <Text
                style={{ color: theme?.colors.gray }}
                className="font-light"
              >
                fdf fsf
              </Text>
            </View>

            {/** STATUS */}
            <View className="flex flex-row items-center gap-1">
              <Text id="status" style={{ color: theme?.colors.text }} className="font-semibold">
                Status:
              </Text>
              <Text nativeID="status" className="text-[#1F9254] font-semibold">
                Finished
              </Text>
            </View>
          </View>

          <View className="mt-7">
            <View className="flex flex-col items-center gap-6">
              <View>
                <SkiaComponent
                  height={250}
                  width={150}
                  color="#D6C890"
                  maxValue={5}
                  value={3}
                />
              </View>
              <Text
                style={{ color: theme?.colors.text }}
                className="text-[1.4rem] font-medium text-center"
              >
                Biodiesel
              </Text>
            </View>
          </View>

          {/** temp and production time */}
          <View className="w-full mt-10 px-6">
            <View className="flex flex-row items-center justify-evenly w-auto">
              {/** temp  */}
              <View className="flex flex-col items-center">
                <Text
                  id="temp"
                  className="font-bold text-[25px] text-[#C66243] "
                >
                  65°C
                </Text>
                <Text className="text-[#C66243] " nativeID="temp">
                  Max. temp
                </Text>
              </View>

              {/**chunks filtered / glycerin */}

              <View className="flex flex-col items-center">
                <Text
                  id="chunks"
                  className="font-bold text-[25px] text-[#376EC2] "
                >
                  75%
                </Text>
                <Text className="text-[#376EC2] " nativeID="chunks">
                  Chunks filtered
                </Text>
              </View>
            </View>

            <View className="flex flex-col items-center mt-8">
              <ProgressChart
                data={progressData}
                height={140}
                strokeWidth={6}
                radius={20}
                width={260}
                hideLegend={true}
                style={{
                  backgroundColor: "transparent",
                }}
                chartConfig={{
                  labels: ["Swim", "Bike", "Run"], // optional
                  backgroundGradientFrom: theme?.colors.background,
                  backgroundGradientTo: theme?.colors.background,
                  color: (opacity = 1) => `rgba(150, 45, 255, ${opacity})`,
                  strokeWidth: 2, // optional, default 3
                  useShadowColorFromDataset: false, // optional
                }}
              />
              <Text
                className="font-semibold"
                style={{ color: theme?.colors.text, fontSize: 16 }}
              >
                1 hour 30 minutes
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}