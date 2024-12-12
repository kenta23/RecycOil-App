import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons'
import { PieChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import { useTheme } from '@react-navigation/native';


export default function Viewdashboard() {
    const pieData = [
        {value: 70, color: '#569F59'},
        {value: 30, color: 'lightgray'}
    ];
    const theme = useTheme();


  return (
    <ScrollView className={`w-full ${theme.dark ? 'text-white' : 'text-black'} px-4 py-4`}>
      {/** Main Sensor view */}
      <View className="w-full mt-2 ">
        {/**Status  */}
        <View className="flex flex-row justify-between mb-6">
          <View className="flex flex-row items-center gap-2">
            <AntDesign name="checkcircle" size={18} color="green" />
            <Text className="text-sm font-semibold">Status</Text>
          </View>

          {/**Machine Start again Button */}
          <Pressable className="flex-row items-center gap-2">
            <Feather name="power" size={18} color="green" />
            <Text className="text-[16px] font-normal">Start new</Text>
          </Pressable>
        </View>

        <View className="flex flex-col items-center gap-6">
          {/**Pie chart biodiesel sensor */}
          <View className="flex flex-col gap-3">
            <PieChart
              donut
              innerRadius={90}
              radius={110}     
              data={pieData}
              gradientCenterColor="#569F59"
              showGradient={true}
              centerLabelComponent={() => {
                return (
                  <Text style={{ fontSize: 40, fontWeight: "600" }}>70%</Text>
                );
              }}
            />
            <Text style={theme.dark ? {color: 'white'} : {color: 'black'}} className="text-lg font-medium text-center">
              Producing percentage
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
                <Text style={theme.dark ? {color: 'white'} : {color: 'black'}}>Temperature</Text>
                <Text style={theme.dark ? {color: 'white'} : {color: 'black'}} className="text-lg font-semibold">20°C</Text>
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
                <Text style={theme.dark ? {color: 'white'} : {color: 'black'}}>Flow rate</Text>
                <Text style={theme.dark ? {color: 'white'} : {color: 'black'}} className="text-lg font-semibold">85%</Text>
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
                <Text style={theme.dark ? {color: 'white'} : {color: 'black'}}>Chunks filtered</Text>
                <Text  style={theme.dark ? {color: 'white'} : {color: 'black'}}className="text-lg font-semibold">95%</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/** Oil Volume and Time production cards */}

      <View className="flex-col items-center gap-5 mt-10 mb-[100px] text-white">
        <View className={`w-[300px] px-4 py-3 h-[180px] bg-black/25 rounded-lg`}>
          <View className="flex-col items-center w-full h-full gap-2 ">
            <View className="flex-row items-center self-start w-full gap-2">
              <FontAwesome6 name="glass-water" size={18} color={theme.dark ? 'white' : 'black'} /> 
              <Text className={`text-lg font-medium ${theme.dark ? 'text-white' : 'text-[#595750'}`}>    Oil Volume
              </Text>
            </View>

            <View className="items-center justify-center flex-1 w-full text-center">
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

        <View className="w-[300px] px-4 py-3 h-[180px] pb-10 bg-white rounded-lg shadow-sm shadow-gray-100 ">
          <View className="flex-col items-center w-full h-full gap-2 ">
            <View className="flex-row items-center self-start w-full gap-2">
              <AntDesign name="clockcircle" size={18} color="#595750" />
              <Text className="text-lg font-medium text-[#595750]">
                Producing time
              </Text>
            </View>

            <View className="items-center justify-center flex-1 w-full text-center">
              {/**Text */}

              <Text className="font-semibold text-[25px] text-center text-wrap">
                2 hours and 30 minutes
              </Text>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}