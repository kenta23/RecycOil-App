import { View, Text, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { AntDesign, Feather, FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import SkiaComponent from '@/skia components/tank-container';
import { PieChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/providers/themeprovider';
import { Image } from 'expo-image';
import { ProgressChart } from 'react-native-chart-kit';
import { piechartData, progressData } from '@/lib/data';


const cardStyle = `w-[300px] px-4 bg-white/20 py-3 h-[180px] shadow-sm border-[1px] border-[#BAB9AC] rounded-lg`;


export default function DashboardNative({ pieData }: { pieData: any }) {
    const theme = useTheme();
    
  return (
   <View className='w-full h-full min-h-screen' style={{ backgroundColor: theme?.colors.background }}>
     <ScrollView showsVerticalScrollIndicator={false} className={`w-full px-4 py-4 max-h-screen-safe-offset-2 h-auto`}>
      {/** Main Sensor view */}
      <View className="w-full mt-2 ">
        {/**Status  */}
        <View className="flex flex-row justify-between w-full mb-6">
            {/** make a conditional statement here if the machine is running or already finished */}
            <View className="flex flex-row items-center gap-2">
              {/* <AntDesign name="checkcircle" size={18} color="green" />
              <Text
                className="text-sm font-semibold"
                style={{ color: theme?.colors.text }}
              >
                Status
              </Text> */}
              <FontAwesome name="circle" size={18} color="#DDAA1D" />
              <Text  style={{ color: theme?.colors.text, fontSize: 16, fontWeight: 'semibold' }}>Running</Text>
            </View>

            {/**Machine Start again Button */}
            <Pressable className="flex-row items-center gap-2">
              {/* <Feather name="power" size={18} color="green" />
              <Text
                className="text-[16px] font-normal"
                style={{ color: theme?.colors.text }}
              >
                Start new
              </Text>
            */}
              <MaterialCommunityIcons name="stop-circle" size={18} color="#EF4949" />
              <Text
                style={{ color: theme?.colors.text,  fontSize: 16, fontWeight: 'semibold' }}
              >
                Stop
              </Text>
            </Pressable>
          </View>

        <View className="flex flex-col items-center gap-6">
          {/**Pie chart biodiesel sensor */}
          <View className="flex flex-col gap-3">
            <SkiaComponent maxValue={5} value={3} />
            <Text
              style={{ color: theme?.colors.text }}
              className="text-lg font-medium text-center"
            >
              Biodiesel
            </Text>
          </View>

          {/**Temp sensors, Flow rate, etc. */}

          <View className="flex-row items-center justify-around w-full ">
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

            {/** Chunks filtered */}
            <View className="flex flex-col items-center w-auto gap-2">
              <Progress.Bar
                color="#629EF9"
                progress={0.4}
                width={100}
                height={8}
              />
              <View className="flex-col items-center">
                <Text style={{ color: theme?.colors.text }}>
                  Chunks filtered
                </Text>
                <Text
                  style={{ color: theme?.colors.text }}
                  className="text-lg font-semibold"
                >
                  95%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/** Oil Volume and Time production cards */}
      <View  className="flex-col items-center justify-center gap-5 mt-10 mb-[100px] text-white">
        <View
          style={{ borderRadius: 16, backgroundColor: theme?.colors.background }}
          className="w-[80%] gap-8 px-4 py-2 border-[1px] border-[#E5E5EF] shadow-gray-300 shadow-sm h-[250px]"
        >
         <View className="gap-2">
            <Text className="text-[18px] font-medium" style={{ color: theme?.colors.gray }}>
              Oil Volume
            </Text>
            <View className="border-[1px] border-[#E5E5EF] h-[1px] w-full" />
          </View>


          {/** Charts here */}
          <View className="items-center justify-center mt-7">
            <PieChart
              semiCircle
              donut
              data={piechartData}
              isAnimated
              radius={100}
              backgroundColor={theme?.colors.background}
              innerRadius={70}
              centerLabelComponent={() => (
                <Text className="text-[18px] font-semibold" style={{ color: theme?.colors.text }}>3 liters</Text>
              )}
            />
          </View>
        </View>

        <View style={{ borderRadius: 16, backgroundColor: theme?.colors.background }} className="w-[80%] gap-4 px-4 py-2 border-[1px] border-[#E5E5EF] shadow-gray-300 shadow-sm h-[250px]">
          <View className="gap-2">
            <Text className="text-[18px] font-medium" style={{ color: theme?.colors.gray }}>
              Production Time
            </Text>
            <View className="border-[1px] border-[#E5E5EF] h-[1px] w-full" />
          </View>

          <View className="items-center ">
            <ProgressChart
              data={progressData}
              height={150}
              strokeWidth={6}
              radius={20}
              width={300}
              
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
            <Text className="text-[18px] font-semibold" style={{ color: theme?.colors.text }}>1 hour 30 minutes</Text>
          </View>
        </View>
      </View>

      <Image
        source={
          theme?.dark
            ? require("../assets/images/logo-white.png")
            : require("../assets/images/logo-black.png")
        }
        contentFit="contain"
        style={{
          width: 100,
          height: 50,
          position: "absolute",
          bottom: 25,
          right: 10,
        }}
      />
     </ScrollView>
    </View>
  );
}