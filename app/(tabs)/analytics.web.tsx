import { View, Text, Pressable, ScrollView, Dimensions, useWindowDimensions,  } from "react-native";
import React from "react";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Image } from "expo-image";
import { useTheme } from "@/providers/themeprovider";

export default function AnalyticsWeb() {
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

  const cardContainerStyle = "w-[380px] rounded-lg items-center justify-center px-4 py-2 border-[1px] border-[#E5E5EF] shadow-gray-300 shadow-sm h-[239px]";
  
  const { width: screenWidth } = useWindowDimensions();

  return (
    <View
      className="w-full h-full min-h-screen"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full h-auto max-h-screen px-8 pb-4"
      >
        <View className="flex items-start justify-center w-full px-4 mt-4 lg:items-center">
          {/**Bar chart */}
          <View className="flex flex-col items-start justify-center w-auto gap-6 mt-6">
            <Text className="text-[22px]" style={{ color: theme?.colors.gray }}>
              Total Production
            </Text>
            <div>
                {/**legend */}
                <div></div>
                {/**toggle */}
            {/* <div className="flex flex-row items-center justify-between w-[100px]">
                
            </div> */}
              <BarChart
                height={400}
                autoCenterTooltip
                yAxisColor={theme?.colors.text}
                verticalLinesColor={theme?.colors.text}
                yAxisIndicesColor={theme?.colors.text}
                xAxisIndicesColor={theme?.colors.text}
                yAxisTextStyle={{ color: theme?.colors.text }}
                xAxisLabelTextStyle={{ color: theme?.colors.text }}
                xAxisThickness={1}
                xAxisColor={theme?.colors.text}
                yAxisThickness={0.5}
                width={screenWidth - 500}
                noOfSections={4}
                maxValue={500}
                stackData={stackData}
                isAnimated
                animationDuration={2000}
                barWidth={70}
           
              />
            </div>
          </View>
        </View>

        <View className="flex flex-row items-center mt-16 justify-evenly">
          <View className="flex-col gap-5">
            <View className={cardContainerStyle}>
              <View className="items-center w-full">
                <View className="flex-col">
                  <Text
                    className="font-normal text-[12px]"
                    style={{ color: theme?.colors.gray }}
                  >
                    Production
                  </Text>
                  <Text
                    className="font-bold text-[16px]"
                    style={{ color: theme?.colors.text }}
                  >
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
                  <Text
                    className="font-normal text-[12px]"
                    style={{ color: theme?.colors.gray }}
                  >
                    Production
                  </Text>
                  <Text
                    className="font-bold text-[16px]"
                    style={{ color: theme?.colors.text }}
                  >
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
          </View>

          <View className="size-[350px] shadow-green-300 shadow-lg items-center justify-center rounded-full border-[1px] border-[#65DE9D]">
            <View className="items-center justify-center w-full">
              <Text
                className="text-[16px] text-center"
                style={{ color: theme?.colors.gray }}
              >
                You saved diesel consumption of
              </Text>
              <Text className="font-bold text-center text-[64px] text-[#DDA01C]">
                50 Liters
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
