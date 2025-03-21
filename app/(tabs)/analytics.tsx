import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { Image } from "expo-image";
import { useTheme } from "@/providers/themeprovider";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Analytics() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Weekly', value: 'weekly'},
    {label: 'Monthly', value: 'monthly'}
  ]);


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
    <SafeAreaView
      edges={['bottom']}
      className="w-full h-full min-h-screen pt-2 pb-4"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        className="w-full h-auto max-h-screen-safe-offset-2"
      >
        <View className="px-4 mt-4">
          {/**Bar chart */}
          <View className="gap-6 mt-4">
            <Text className="text-[22px]" style={{ color: theme?.colors.gray }}>
              Total Production
            </Text>

            <View className="flex flex-row items-center justify-end w-full gap-3">
              {/**Dropdown picker */}
              <DropDownPicker
                listMode="SCROLLVIEW"
                open={open}
                value={value}
                items={items}
                placeholder="Weekly"
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={{
                  height: 40,
                  width: 120,
                  alignSelf: "flex-end",
                }}
                dropDownContainerStyle={{
                  backgroundColor: theme?.colors.background,
                  borderColor: theme?.colors.gray,
                  borderWidth: 1,
                }}

                //start
                labelStyle={{ color: theme?.colors.text }}
                selectedItemContainerStyle={{
                  backgroundColor: theme?.colors.background,
                }}
                theme={theme?.dark ? 'DARK' : 'LIGHT'}
                containerStyle={{
                  width: 120,
                  alignSelf: 'flex-end'
                }}
                maxHeight={180}
                textStyle={{ color: theme?.colors.gray }}
                placeholderStyle={{ color: theme?.colors.text }}
              />
            </View>

            <View className="flex flex-col items-end justify-end px-2 gap-7">
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

              {/**legend */}
              <View className="flex flex-row items-end justify-end gap-4">
                <View className="flex flex-row items-center justify-between gap-1">
                  <View className="size-3 bg-[#C8BB2A] rounded-full" />
                  <Text
                    className="text-sm font-medium"
                    style={{ color: theme?.colors.text }}
                  >
                    Finished
                  </Text>
                </View>

                <View className="flex flex-row items-center justify-center gap-1">
                  <View className="size-3 bg-[#E5CA7D] rounded-full" />
                  <Text
                    className="text-sm font-medium"
                    style={{ color: theme?.colors.text }}
                  >
                    Unfinished
                  </Text>
                </View>

                <View className="flex flex-row items-center justify-center gap-1">
                  <View className="size-3 bg-[#E5E2BB] rounded-full" />
                  <Text
                    className="text-sm font-medium"
                    style={{ color: theme?.colors.text }}
                  >
                    Failed
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-col items-center w-full gap-5 mt-10">
          <View style={{ backgroundColor: theme?.colors.background }} className={cardContainerStyle}>
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

          <View style={{ backgroundColor: theme?.colors.background }} className={cardContainerStyle}>
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
                    0hr 0min
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

          <View style={{ backgroundColor: theme?.colors.background }} className={cardContainerStyle}>
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
                  Total used oil
                </Text>

                <View className="flex-row items-center justify-between">
                  <Text className="font-bold text-[27px] text-[#22546F]">
                    0hr 0min
                  </Text>
                  <Image
                    source={require("../../assets/images/oil.png")}
                    style={{
                      width: 150,
                      height: 85,
                    }}
                    contentFit="contain"
                  />
                </View>
              </View>
            </View>
          </View>

  {/**Carbon footprint */}
          <View
            style={{ backgroundColor: theme?.colors.background }}
            className="size-[18rem] px-3 py-1 shadow-green-300 shadow-lg mt-8 items-center justify-center rounded-full border-[1px] border-[#65DE9D]"
          >
            <View className="items-center justify-center w-full">
              <Text
                className="text-center text-md"
                style={{ color: theme?.colors.gray }}
              >
                You saved total Carbon footprint (CO₂e) of
              </Text>
              <Text className="font-bold text-center text-[3.7rem] text-[#DDA01C]">
                {/** Formula: used oil litres × 1.8 = kg CO₂e saved */}
                0 kg
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
