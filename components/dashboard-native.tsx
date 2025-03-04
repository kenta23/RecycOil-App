import { View, Text, Pressable, ScrollView, Platform } from 'react-native'
import React from 'react'
import { AntDesign, Feather, FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import SkiaComponent from '@/skia components/tank-container';
import { PieChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/providers/themeprovider';
import { Image } from 'expo-image';
import { ProgressChart } from 'react-native-chart-kit';
import { piechartData, progressData } from '@/lib/data';
import { SafeAreaView } from 'react-native-safe-area-context';


const cardStyle = `w-[300px] px-4 bg-white/20 py-3 h-[180px] shadow-sm border-[1px] border-[#BAB9AC] rounded-lg`;


export default function DashboardNative({ pieData }: { pieData: any }) {
    const theme = useTheme();
    
  return (
   <SafeAreaView edges={['bottom']} className='w-full h-full min-h-screen' style={{ backgroundColor: theme?.colors.background }}>
     <ScrollView scrollEnabled showsVerticalScrollIndicator={false} className={`w-full pb-4 px-4 max-h-screen-safe-offset-2 h-full`}>
      {/** Main Sensor view */}

      {/**push buttons */}
      <View className='flex self-center justify-center flex-row w-auto max-w-[19.6rem] h-auto py-2 items-center gap-16'>
          <View className='flex flex-col items-center gap-2'>
             <View className='p-2 bg-[#EFE3CA] rounded-full'>
               <Pressable className='bg-[#6FEA37] size-8 rounded-full'/>
             </View>
             <Text className='text-sm' style={{ color: theme?.colors.text }}>Start</Text>
          </View>

          <View className='flex flex-col items-center gap-2'>
             <View className='p-2 bg-[#EFE3CA] rounded-full'>
               <Pressable className='bg-[#e9c536] size-8 rounded-full'/>
             </View>
             <Text className='text-sm' style={{ color: theme?.colors.text }}>Pause</Text>
          </View>

          <View className='flex flex-col items-center gap-2'>
             <View className='p-2 bg-[#EFE3CA] rounded-full'>
               <Pressable className='bg-[#e93636] size-8 rounded-full'/>
             </View>
             <Text className='text-sm' style={{ color: theme?.colors.text }}>Stop</Text>
          </View>
            
      </View>


      <View className="w-full mt-2">
        <View className="flex flex-col items-center gap-6">
          {/**bar chart biodiesel sensor */}
          <View className="flex flex-col gap-3">
            <SkiaComponent
              color='#78B544'
              {...(Platform.OS === 'web' ? { width: 190, height: 300 } : {  width: 160, height: 250 })}
              maxValue={5}
              value={3}
            />
            <Text
              style={{ color: theme?.colors.text }}
              className="text-lg font-medium text-center"
            >
              Biodiesel
            </Text>
          </View>

          {/**Temp sensors, Flow rate, etc. */}

          <View className="flex-row items-center w-full justify-evenly ">
            {/** Temp sensor */}
            <View className="flex flex-col items-center w-auto gap-2">
              <Progress.Bar
                progress={0.3}
                color="#F98662"
                width={100}
                height={8}
              />
              <View className="flex-col items-center">
                <Text style={{ color: theme?.colors.text }}>Temperature</Text>
                <Text
                  style={{ color: theme?.colors.text }}
                  className="text-lg font-semibold"
                >
                  20°C
                </Text>
              </View>
            </View>

            {/** Flow rate sensor */}
            <View className="flex flex-col items-center w-auto gap-2">
              <Progress.Bar
                color="#8962F9"
                progress={0.6}
                width={100}
                height={8}
              />
              <View className="flex-col items-center">
                <Text style={{ color: theme?.colors.text }}>Flow rate</Text>
                <Text
                  style={{ color: theme?.colors.text }}
                  className="text-lg font-semibold"
                >
                  85%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/** Oil Volume and Time production cards */}
      <View className={`${Platform.OS === 'web' ? 'flex-row mt-10' : 'flex-col mt-8'} items-center w-full justify-center gap-8 text-white`}>
        <View
          style={{ borderRadius: 16, backgroundColor: theme?.colors.background }}
          className="w-[20.43rem] h-[16.5rem] gap-8 px-4 py-2 border-[1px] border-[#E5E5EF]"
        >
         <View className="gap-2">
            <Text className="text-lg font-medium" style={{ color: theme?.colors.gray }}>
              Oil Volume
            </Text>
            <View className="border-[1px] border-[#E5E5EF] h-[1px] w-full" />
          </View>


          {/** Charts here */}
          <View className="items-center justify-center">
            <PieChart
              donut
              data={piechartData}
              isAnimated
              radius={70}
              backgroundColor={theme?.colors.background}
              innerRadius={50}
              centerLabelComponent={() => (
                <Text className="text-sm font-semibold" style={{ color: theme?.colors.text }}>3 liters</Text>
              )}
            />
          </View>
        </View>

        <View style={{ borderRadius: 16, backgroundColor: theme?.colors.background }} className="w-[20.43rem] h-[16.5rem] gap-2 px-4 py-2 border-[1px] border-[#E5E5EF]">
          <View className="gap-2">
            <Text className="text-lg font-medium" style={{ color: theme?.colors.gray }}>
              Production Time 
            </Text>
            <View className="border-[1px] border-[#E5E5EF] h-[1px] w-full" />
          </View>

          <View className="items-center">
            <ProgressChart
              data={progressData}
              height={150}
              strokeWidth={6}
              radius={20}
              width={260}
              style={{
                 backgroundColor: 'transparent'
              }}
              hideLegend={true}
              chartConfig={{
                labels: ["Swim", "Bike", "Run"], // optional
                backgroundGradientFrom: theme?.colors.background,
                backgroundGradientTo: theme?.colors.background,
                color: (opacity = 1) => `rgba(150, 45, 255, ${opacity})`, 
                strokeWidth: 2, // optional, default 3
                useShadowColorFromDataset: false, // optional
              }}
            />
            <Text className="text-sm font-semibold" style={{ color: theme?.colors.text }}>1 hour 30 minutes</Text>
          </View>
        </View>
      </View>
     </ScrollView>
    </SafeAreaView>
  );
}