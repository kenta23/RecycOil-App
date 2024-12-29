import { View, Text, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { AntDesign, Feather, FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import SkiaComponent from '@/skia components/tank-container';
import { PieChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/providers/themeprovider';
import { ProgressChart } from 'react-native-chart-kit';
import { piechartData, progressData } from '@/lib/data';
import { SafeAreaView } from 'react-native-safe-area-context';


const containerStyle = "md:w-[320px] lg:w-[400px] xl:w-[500px] bg-white/10 gap-4 px-4 py-2 border-[1px] border-[#E5E5EF] shadow-gray-300 shadow-sm h-[320px]";

export default function DashboardWeb({ pieData }: { pieData: any }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: theme?.colors.background }} className="relative w-full min-h-svh max-h-svh">
     <ScrollView className="items-center w-full h-auto mx-auto max-h-screen-safe-offset-2">
        <View
          className="flex-col items-center w-full"
        >
          {/** Main Sensor view */}
          <View className="border-[#BAB9AC] w-full bg-white/10 self-center justify-self-center border-[1px] rounded-lg px-6 py-8 mt-4">
            <View className="items-center">
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
                  <Text
                    style={{
                      color: theme?.colors.text,
                      fontSize: 20,
                      fontWeight: "semibold",
                    }}
                  >
                    Running
                  </Text>
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
                  <MaterialCommunityIcons
                    name="stop-circle"
                    size={24}
                    color="#EF4949"
                  />
                  <Text
                    style={{
                      color: theme?.colors.text,
                      fontSize: 20,
                      fontWeight: "semibold",
                    }}
                  >
                    Stop
                  </Text>
                </Pressable>
              </View>

              <View className="flex flex-col items-center w-full gap-6 justify-evenly">
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
                <View className="flex-row items-center justify-around w-full gap-3">
                  {/** Temp sensor */}
                  <View className="flex flex-col items-center w-auto gap-2">
                    <Progress.Bar
                      progress={0.3}
                      color="#F98662"
                      width={100}
                      height={8}
                    />
                    <View className="flex-col items-center">
                      <Text style={{ color: theme?.colors.text }}>
                        Temperature
                      </Text>
                      <Text
                        style={{ color: theme?.colors.text }}
                        className="text-lg font-semibold text-center"
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
                      <Text style={{ color: theme?.colors.text }}>
                        Flow rate
                      </Text>
                      <Text
                        style={{ color: theme?.colors.text }}
                        className="text-lg font-semibold"
                      >
                        85%
                      </Text>
                    </View>
                  </View>

                  {/** Flow rate sensor */}
                  <View className="flex flex-col items-start w-auto gap-2">
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
          </View>

          {/**pie charts card */}
          <View className="flex-row  items-center justify-center gap-5 mt-10 mb-[100px] text-white">
            <View
              style={{ borderRadius: 16 }}
              className={containerStyle}
            >
              <View className="gap-2">
                <Text
                  className="text-[18px] font-normal"
                  style={{ color: theme?.colors.gray }}
                >
                  Oil Volume
                </Text>
                <View className="border-[1px] border-[#E5E5EF] h-[1px] w-full" />
              </View>

              {/** Charts here */}
              <View className="items-center justify-center mt-7">
                <PieChart
                  donut
                  data={piechartData}
                  isAnimated
                  radius={100}
                  innerCircleColor={'#83787A'}
                  innerRadius={70}
                  centerLabelComponent={() => (
                    <Text
                      className="text-[18px] font-semibold"
                      style={{ color: theme?.colors.text }}
                    >
                      3 liters
                    </Text>
                  )}
                />
              </View>
            </View>

            <View
              style={{
                borderRadius: 16,
              }}
              className={containerStyle}
            >
              <View className="gap-2">
                <Text
                  className="text-[18px] font-normal"
                  style={{ color: theme?.colors.gray }}
                >
                  Production Time
                </Text>
                <View className="border-[1px] border-[#E5E5EF] h-[1px] w-full" />
              </View>

              <View className="items-center gap-4 mt-5">
                <ProgressChart
                  data={progressData}
                  height={150}
                  strokeWidth={6}
                  radius={40}
                  width={300}
                  hideLegend={true}
                  chartConfig={{
                    labels: ["Swim", "Bike", "Run"], // optional
                    backgroundGradientFrom: 'transparent',
                    backgroundGradientTo: 'transparent',
                    color: (opacity = 1) => `rgba(150, 45, 255, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    useShadowColorFromDataset: false, // optional
                  }}
                />
                <Text
                  className="font-semibold"
                  style={{ color: theme?.colors.text, fontSize: 22 }}
                >
                  1 hour 30 minutes
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}