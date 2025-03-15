import { View, Text, Pressable, ScrollView, Platform, ActivityIndicator, Alert, } from 'react-native'
import React, { useEffect, useState } from 'react'
import SkiaComponent from '@/skia components/tank-container';
import { PieChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/providers/themeprovider';
import { Image } from 'expo-image';
import { ProgressChart } from 'react-native-chart-kit';
import { piechartData, progressData } from '@/lib/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/authprovider';
import { useButtonStart } from '@/lib/store';
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


//for web 
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import RenderTankOnWeb from './renderTankOnWeb';
import { ProgressChartData } from 'react-native-chart-kit/dist/ProgressChart';



export default function DashboardNative({
  pieData,
  status,
  producingTime,
  temperature,
  flowRate,
  biodiesel,
  carbonFootprint,
  energyConsumption
}: {
  pieData: any;
  temperature: number;
  flowRate: number;
  biodiesel: number;
  carbonFootprint: number;
  status: string | null;
  producingTime: number;
  energyConsumption: number 
}) {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const {buttonStart, setButtonStart } = useButtonStart();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  

  useEffect(() => {
    if (buttonStart) {
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false); // Show content after delay
      }, 1500); // Delay for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [buttonStart]);


  const MAX_LITERS = 6; // Maximum capacity of the pie chart

  const [piechartData, setPiechartData] = useState([
    {
      value: (flowRate / MAX_LITERS) * 100, // Convert flowRate into a percentage
      color: "#DB2777",
    },
    {
      value: 100 - (flowRate / MAX_LITERS) * 100, // Remaining part of the pie chart
      color: "lightgray",
    },
  ]);


  useEffect(() => {
    setPiechartData([
      {
        value: (flowRate / MAX_LITERS) * 100, // Convert flowRate into a percentage
        color: "#DB2777",
      },
      {
        value: 100 - (flowRate / MAX_LITERS) * 100, // Remaining part
        color: "lightgray",
      },
    ]);
  }, [flowRate]);


  //format milliseconds to hours, minutes, and seconds 
  const formatMsToHMS = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000) || 0;
    const hours = Math.floor(totalSeconds / 3600) || 0;
    const minutes = Math.floor((totalSeconds % 3600) / 60) || 0;
    const seconds = totalSeconds % 60 || 0;

    return {
      hours,
      minutes,
      seconds
    }
};

 function formatTimeStr (milliseconds: number) { 
  const { hours, minutes, seconds } = formatMsToHMS(milliseconds);
  return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
 }


  function timeProgressFormat (milliseconds: number): ProgressChartData {
    const { hours, minutes, seconds } = formatMsToHMS(milliseconds);

    console.log(hours, minutes, seconds);
    return { 
      labels: ['Hours', 'Minutes', 'Seconds'],
      data:  [hours, minutes, seconds].map(val => val === 1 ? 1 : val / 60), //max is 1 min is 0
      colors: ['#DB2777', '#DB2777', '#DB2777']
    };

 } 
    
 

  console.log('button start', buttonStart);
  console.log('show dialog', showDialog);

  const handleMachineStop = () => { 
    if (Platform.OS === 'web') { 
      setShowDialog(true);
    } 
    else { 
       Alert.alert('Are you sure you want to stop the machine?');
    }
  }

  const showAlert = () => {
    Alert.alert("Warning", "Are you sure you want to stop?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => console.log("Stopped") },
    ]);
  };


 
  
  return (
    <SafeAreaView
      edges={["bottom"]}
      className="w-full h-full min-h-screen"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        className={`w-full px-4 max-h-screen-safe-offset-2 h-full`}
      >
        {/** Main Sensor view */}

        {/**push buttons */}
        <View className="flex self-center justify-center flex-row w-auto max-w-[19.6rem] h-auto py-2 items-center gap-16">
          <View className="flex flex-col items-center gap-2">
            <View className="p-2 bg-[#EFE3CA] rounded-full">
              <Pressable
                disabled={buttonStart}
                onPress={() => setButtonStart(true)}
                className="bg-[#6FEA37] size-8 rounded-full"
              />
            </View>
            <Text className="text-sm" style={{ color: theme?.colors.text }}>
              Start
            </Text>
          </View>

          {Platform.OS === "web" ? (
            <AlertDialog>
              <AlertDialogTrigger disabled={!buttonStart}>
                <View>
                  <View
                    style={{ opacity: !buttonStart ? 0.5 : 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <View className="p-2 bg-[#EFE3CA] rounded-full">
                      <View className="bg-[#e93636] size-8 rounded-full" />
                    </View>
                    <Text
                      className="text-sm"
                      style={{ color: theme?.colors.text }}
                    >
                      Stop
                    </Text>
                  </View>
                </View>
              </AlertDialogTrigger>
              <AlertDialogContent
                style={{
                  backgroundColor: theme?.colors.background,
                  color: theme?.colors.text,
                }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Do you want to stop the machine?
                  </AlertDialogTitle>
                  <AlertDialogDescription style={{ color: theme?.colors.gray }}>
                    the machine is currently running, if you wish to stop, the
                    process might be discontinued
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    style={{
                      backgroundColor: "transparent",
                      color: theme?.colors.text,
                      border: "1px solid #FFFFFF",
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    style={{
                      backgroundColor: "#e93636",
                      color: theme?.colors.text,
                    }}
                    onClick={() => setButtonStart(false)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Pressable onPress={showAlert}>
              <View
                style={{ opacity: !buttonStart ? 0.5 : 1 }}
                className="flex flex-col items-center gap-2"
              >
                <View className="p-2 bg-[#EFE3CA] rounded-full">
                  <View className="bg-[#e93636] size-8 rounded-full" />
                </View>
                <Text className="text-sm" style={{ color: theme?.colors.text }}>
                  Stop
                </Text>
              </View>
            </Pressable>
          )}
        </View>

        {loading && <ActivityIndicator size="large" />}

        <View style={{ opacity: buttonStart && !loading ? 1 : 0.5 }}>
          <View className="w-full mt-2">
            <View className="flex flex-col items-center gap-6">
              {/**bar chart biodiesel sensor */}
              <View className="flex flex-col gap-3">

                  <SkiaComponent
                    color="#78B544"
                    width={160}
                    height={250}
                    maxValue={5}
                    value={loading && !buttonStart ? 0 : biodiesel}
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
                    progress={
                      loading && !buttonStart
                        ? 0
                        : Number(temperature) / 100 || 0
                    }
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
                      className="text-lg font-semibold"
                    >
                      {loading && !buttonStart
                        ? "..."
                        : !Number.isNaN(temperature)
                        ? `${Number(temperature).toFixed(2)} C`
                        : `${0.0} C`}
                    </Text>
                  </View>
                </View>

                {/** Flow rate sensor */}
                <View className="flex flex-col items-center w-auto gap-2">
                  <Progress.Bar
                    color="#8962F9"
                    progress={
                      loading && !buttonStart ? 0 : Number(flowRate) / 10 || 0
                    }
                    width={100}
                    height={8}
                  />
                  <View className="flex-col items-center">
                    <Text style={{ color: theme?.colors.text }}>Flow rate</Text>
                    <Text
                      style={{ color: theme?.colors.text }}
                      className="text-lg font-semibold"
                    >
                      {loading && !buttonStart
                        ? "..."
                        : !Number.isNaN(flowRate)
                        ? `${Number(flowRate).toFixed(2)} L/min`
                        : `${0.0} L/min`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="flex items-center w-full my-6">
            <Text style={{ color: theme?.colors.text }} className="text-lg">
              {status === "Not Running" ? "Not Running" : "Running"}
            </Text>
          </View>

          {/** Oil Volume and Time production cards */}
          <View
            className={`${
              Platform.OS === "web" ? "flex-row" : "flex-col"
            } items-center w-full justify-center gap-8 text-white`}
          >
            <View
              style={{
                borderRadius: 16,
                backgroundColor: theme?.colors.background,
              }}
              className="w-[20.43rem] h-[16.5rem] gap-8 px-4 py-2 border-[1px] border-[#E5E5EF]"
            >
              <View className="gap-2">
                <Text
                  className="text-lg font-medium"
                  style={{ color: theme?.colors.gray }}
                >
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
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: theme?.colors.text }}
                    >
                      {loading && !buttonStart ? "..." : flowRate + " liters"}
                    </Text>
                  )}
                />
              </View>
            </View>

            <View
              style={{
                borderRadius: 16,
                backgroundColor: theme?.colors.background,
              }}
              className="w-[20.43rem] h-[16.5rem] gap-2 px-4 py-2 border-[1px] border-[#E5E5EF]"
            >
              <View className="gap-2">
                <Text
                  className="text-lg font-medium"
                  style={{ color: theme?.colors.gray }}
                >
                  Production Time
                </Text>
                <View className="border-[1px] border-[#E5E5EF] h-[1px] w-full" />
              </View>

              <View className="items-center">
                <ProgressChart
                  data={timeProgressFormat(producingTime)}
                  height={150}
                  strokeWidth={6}
                  radius={20}
                  width={260}
                  style={{
                    backgroundColor: "transparent",
                  }}
                  hideLegend={true}
                  chartConfig={{
                    labels: ["Hours", "Minutes", "Seconds"], // optional
                    backgroundGradientFrom: theme?.colors.background,
                    backgroundGradientTo: theme?.colors.background,
                    color: (opacity = 1) => `rgba(150, 45, 255, ${opacity})`,
                    strokeWidth: 2, // optional, default 3 
                    useShadowColorFromDataset: false, // optional
                  }}
                />
                <Text
                  className="text-sm font-semibold"
                  style={{ color: theme?.colors.text }}
                >
                  {loading && !buttonStart
                    ? "..."
                    : formatTimeStr(producingTime) || "0 min"}
                </Text>
              </View>
            </View>
          </View>

          {/** Carbon footprint and energy consumption cards */}
          <View className="flex flex-row items-center justify-center gap-6 mt-5">
            {/**Carbon footprint */}
            <View
              style={{
                borderRadius: 16,
                backgroundColor: theme?.colors.background,
              }}
              className="w-[20.43rem] flex items-center justify-center h-[12rem] gap-2 px-4 py-2 border-[1px] border-[#E5E5EF]"
            >
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../assets/images/mdi_leaf.svg")}
                  style={{ width: 30, height: 30 }}
                />
                <Text className="text-[#15D037] text-lg">
                  You saved {carbonFootprint} kg of CO2
                </Text>
              </View>

              <Text
                className="font-normal text-center"
                style={{ color: theme?.colors.gray }}
              >
                By reusing oil, you can save up to 1 kg per 5 liter
              </Text>
            </View>

            {/**Energy consumption */}
            <View
              style={{
                borderRadius: 16,
                backgroundColor: theme?.colors.background,
              }}
              className="w-[20.43rem] flex items-center justify-center h-[12rem] gap-2 px-4 py-2 border-[1px] border-[#E5E5EF]"
            >
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../assets/images/mdi_thunder.svg")}
                  style={{ width: 30, height: 30 }}
                />
                <Text className="text-[#DEC536] font-normal text-lg">
                  Energy consumption
                </Text>
              </View>

              <Text
                className="text-xl font-medium text-center"
                style={{ color: theme?.colors.gray }}
              >
                {energyConsumption} kWh
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}