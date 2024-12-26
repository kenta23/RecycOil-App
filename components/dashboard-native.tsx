import { View, Text, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons';
import SkiaComponent from '@/skia components/tank-container';
import { PieChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/providers/themeprovider';
import { Image } from 'expo-image';


const cardStyle = `w-[300px] px-4 bg-white/20 py-3 h-[180px] shadow-sm border-[1px] border-[#BAB9AC] rounded-lg`;

export default function DashboardNative({ pieData }: { pieData: any }) {
    const theme = useTheme();
    
  return (
    <ScrollView className={`w-full px-4 py-4 max-h-screen`}>
    {/** Main Sensor view */}
    <View className="w-full mt-2 ">
      {/**Status  */}
      <View className="flex flex-row justify-between mb-6">
        <View className="flex flex-row items-center gap-2">
          <AntDesign name="checkcircle" size={18} color="green" />
          <Text
            className="text-sm font-semibold"
            style={{ color: theme?.colors.text }}
          >
            Status
          </Text>
        </View>

        {/**Machine Start again Button */}
        <Pressable className="flex-row items-center gap-2">
          <Feather name="power" size={18} color="green" />
          <Text
            className="text-[16px] font-normal"
            style={{ color: theme?.colors.text }}
          >
            Start new
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

          {/** Flow rate sensor */}
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
    <View className="flex-col items-center gap-5 mt-10 mb-[100px] text-white">
      <View
        className={cardStyle}
      >
        <View className="flex-col items-center w-full h-full gap-2 ">
          <View className="flex-row items-center self-start w-full gap-2">
            <FontAwesome6
              name="glass-water"
              size={16}
              color={theme?.colors.text}
            />
            <Text
              className={`text-sm font-medium`}
              style={{ color: theme?.colors.text }}
            >
              {" "}
              Oil Volume
            </Text>
          </View>

          <View className="items-center justify-center flex-1 w-full text-center ">
            {/**Volume chart here */}    
              <PieChart
                donut
                innerRadius={80}
                endAngle={90}
                pieInnerComponentHeight={200}
                pieInnerComponentWidth={100}
                semiCircle
                radius={115}
                data={pieData}
                centerLabelComponent={() => {
                  return (
                    <Text className="text-lg font-semibold">1.3 Litres</Text>
                  );
                }}
              />
          </View>
        </View>
      </View>

      <View className={cardStyle}>
        <View className="flex-col items-center w-full h-full gap-2 ">
          <View className="flex-row items-center self-start w-full gap-2">
            <AntDesign name="clockcircle" size={16} color="#595750" />
            <Text className="text-sm font-medium text-[#595750]">
              Producing time
            </Text>
          </View>

          <View className="items-center justify-center flex-1 w-full text-center">
            {/**Text */}

            <Text className="font-semibold text-[20px] text-center text-wrap">
              2 hrs and 30 min
            </Text>
          </View>
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
        bottom: 55,
        right: 10,
      }}
    />
  </ScrollView>
  )
}