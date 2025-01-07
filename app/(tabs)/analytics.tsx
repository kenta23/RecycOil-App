import { View, Text, Pressable, ScrollView,  } from "react-native";
import React from "react";
import { supabase } from "@/lib/supabase";
import { Redirect } from "expo-router";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { ProgressChart } from "react-native-chart-kit";
import { Image } from "expo-image";
import { useTheme } from "@/providers/themeprovider";

export default function Analytics() {
  const theme = useTheme();

  const legend = [
    {
      label: "Finished",
      frontColor: "#C8BB2A",
    },
    {
      label: "Unfinished",
      frontColor: "#E5CA7D",
    },
    {
      label: "Failed",
      frontColor: "#E5E2BB",
    },
  ];

  //passing values as object
  const dummyValues = [{
    finished: 100,
    unfinished: 190,
    failed: 70
  }];
  
  const stackData = [
    {
      stacks: [
        { value: dummyValues[0].finished, color: legend[0].frontColor},
        { value: dummyValues[0].unfinished, color: legend[1].frontColor},
        { value: dummyValues[0].failed, color: legend[2].frontColor},
      ],
      label: '1pm',
    },
    {
      stacks: [
        { value: 2, color: legend[0].frontColor},
        { value: 4, color: legend[1].frontColor},
        { value: 5, color: legend[2].frontColor},
      ],
      label: '1pm',
    },
    {
      stacks: [
        { value: dummyValues[0].finished, color: legend[0].frontColor},
        { value: dummyValues[0].unfinished, color: legend[1].frontColor},
        { value: dummyValues[0].failed, color: legend[2].frontColor},
      ],
      label: '1pm',
    },
    {
      stacks: [
        { value: dummyValues[0].finished, color: legend[0].frontColor},
        { value: dummyValues[0].unfinished, color: legend[1].frontColor},
        { value: dummyValues[0].failed, color: legend[2].frontColor},
      ],
      label: '1pm',
    },
    {
      stacks: [
        { value: dummyValues[0].finished, color: legend[0].frontColor},
        { value: dummyValues[0].unfinished, color: legend[1].frontColor},
        { value: dummyValues[0].failed, color: legend[2].frontColor},
      ],
      label: '1pm',
    },
    
    
  ];  //today, weekly, monthly

  const piechartData = [
    { 
      value: 30,
      color: "#DB2777"
    },
    {
      value: 70,
      color: "lightgray"
    },
  ]

  const progressData = {
    labels: ["Swim", "Bike", "Run"], // optional
    data: [0.4, 0.6, 0.8]
  };

  const cardContainerStyle = "w-[80%] items-center justify-center px-4 py-2 border-[1px] border-[#E5E5EF] shadow-gray-300 shadow-sm h-[200px]";
  

  return (
   <View className="w-full h-full min-h-screen" style={{ backgroundColor: theme?.colors.background }}>
     <ScrollView showsVerticalScrollIndicator={false} className="w-full h-auto max-h-screen-safe-offset-2">
      <View className="px-4 mt-4">
      
        {/**Bar chart */}
        <View className="gap-6 mt-6">
          <Text className="text-[22px]" style={{ color: theme?.colors.gray }}>Total Production</Text>
          <BarChart
            height={250}
            yAxisColor={theme?.colors.text}
            verticalLinesColor={theme?.colors.text}
            yAxisIndicesColor={theme?.colors.text}
            xAxisIndicesColor={theme?.colors.text}
            yAxisTextStyle={{ color: theme?.colors.text }}
            xAxisLabelTextStyle={{ color: theme?.colors.text }}
            xAxisThickness={1}
            xAxisColor={theme?.colors.text}
            yAxisThickness={0.5}
            width={300}
            noOfSections={4}
            maxValue={500}
            stackData={stackData}
            isAnimated
            animationDuration={2000}
            barWidth={40}
          />
        </View>
      </View>

      <View className="flex-col items-center w-full gap-5 mt-12">
        <View style={{ borderRadius: "50px" }} className={cardContainerStyle}>
          <View className="items-center w-full">
            <View className="flex-col">
              <Text className="font-normal text-[12px]" style={{ color: theme?.colors.gray }}>
                Production
              </Text>
              <Text className="font-bold text-[16px]" style={{ color: theme?.colors.text }}>
                Min. Production Time
              </Text>

              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-[27px] text-[#70761D]">
                  2hr 3min
                </Text>
                <Image
                  source={require("../../assets/images/line-graph.png")}
                  style={{
                    width: 150,
                    height: 115,
                  }}
                  contentFit="contain"
                />
              </View>
            </View>
          </View>
        </View>

        <View className={cardContainerStyle}>
          <View className="items-center w-full">
            <View className="flex-col">
              <Text className="font-normal text-[12px]" style={{ color: theme?.colors.gray }}>
                Production
              </Text>
              <Text className="font-bold text-[16px]" style={{ color: theme?.colors.text }}>
                Max. Production Time
              </Text>

              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-[27px] text-[#D62F19]">
                  5hr 3min
                </Text>
                <Image
                  source={require("../../assets/images/line-graph-red.png")}
                  style={{
                    width: 150,
                    height: 115,
                  }}
                  contentFit="contain"
                />   
              </View>
            </View>
          </View>
        </View>



        <View className="size-[290px] shadow-green-300 shadow-lg  mt-12 items-center justify-center rounded-full border-[1px] border-[#65DE9D]">
          <View className="items-center justify-center w-full">
               <Text className="text-[16px] text-center" style={{ color: theme?.colors.gray }}>
                   You saved carbon footprint of
               </Text>
               <Text className="font-bold text-center text-[48px] text-[#DDA01C]">50 Liters</Text>
          </View>
        </View>

      </View>
      </ScrollView>
     </View>
  );
}
