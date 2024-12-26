import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons';
import SkiaComponent from '@/skia components/tank-container';
import { PieChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/providers/themeprovider';
import { Image } from 'expo-image';

export default function DashboardWeb({ pieData }: { pieData: any }) {
  const theme = useTheme();

  return (
    <View className='relative w-full min-h-svh'>
      <View className="flex-col items-center justify-center mx-auto w-[80%] min-h-screen">
      {/** Main Sensor view */}
      <View className="border-[#BAB9AC] self-center justify-self-center border-[1px] rounded-lg w-full px-6 py-8 mt-10">
        <View className="items-center">
          <View className="flex flex-row justify-between w-full mb-6">
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

          <View className="flex flex-row items-center w-full gap-6 justify-evenly">
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

            <View className="flex-col items-start justify-around w-auto gap-3">
              {/** Temp sensor */}
              <View className="flex flex-col items-start w-auto gap-2">
                <Progress.Bar
                  progress={0.3}
                  color="#F98662"
                  width={100}
                  height={8}
                />
                <View className="flex-col items-start">
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
              <View className="flex flex-col items-start w-auto gap-2">
                <Progress.Bar
                  color="#8962F9"
                  progress={0.6}
                  width={100}
                  height={8}
                />
                <View className="flex-col items-start">
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
              <View className="flex flex-col items-start w-auto gap-2">
                <Progress.Bar
                  color="#629EF9"
                  progress={0.4}
                  width={100}
                  height={8}
                />
                <View className="flex-col items-start">
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

      <View className="w-full">
          <View className="flex-row items-center gap-3 mt-6 text-white">
            <View
              className={`flex-1 shadow-sm border-[1px] border-[#BAB9AC] px-4 bg-white/20 py-3 min-h-[250px] rounded-lg`}
            >
              <View className="flex-col items-center w-full h-full gap-2 ">
                <View className="flex-row items-center self-start w-full gap-2">
                  <FontAwesome6
                    name="glass-water"
                    size={16}
                    color={'#595750'}
                  />
                  <Text
                    className={`text-sm font-medium`}
                    style={{ color: '#595750' }}
                  >
                    {" "}
                    Oil Volume
                  </Text>
                </View>
              </View>


              <View className="items-center justify-center flex-1 w-full text-center ">
                  {/**Volume chart here */}
                   <PieChart
                      donut
                      innerRadius={70}
                      startAngle={90}
                      pieInnerComponentHeight={200}
                      pieInnerComponentWidth={100}
                      radius={95}
                      data={pieData}
                      centerLabelComponent={() => {
                        return (
                          <Text className="text-lg font-semibold">
                             1.3 Litres
                          </Text>
                        );
                      }}
                    />
                </View>
            </View>

            <View className="flex-1 px-4 py-3 border-[1px] border-[#BAB9AC] min-h-[250px] pb-8 rounded-lg shadow-sm">
              <View className="flex-col items-center justify-around w-full h-full gap-[100px] ">
                <View className="flex-row items-center self-start w-full gap-2">
                  <AntDesign name="clockcircle" size={16} color="#595750" />
                  <Text className="text-md font-medium text-[#595750]">
                    Production time
                  </Text>
                </View>
              </View>


              
              <View className="items-center justify-center flex-1 w-full text-center">
                  {/**Text */}

                  <Text className="text-[25px] font-semibold text-center text-wrap">
                    2 hrs and 30 min
                  </Text>
                </View>
            </View>
          </View>
        </View>
      </View>
     </View>
  )
}