import { View, Text, Pressable, ScrollView, Dimensions, useWindowDimensions,  } from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Image } from "expo-image";
import { useTheme } from "@/providers/themeprovider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/authprovider";
import { formatTime } from "@/lib/utils";

const cardContainerStyle = "w-[12.5rem] md:w-[14rem] lg:w-[18rem] rounded-lg items-center justify-center px-4 py-2 border-[1px] border-[#E5E5EF] shadow-gray-300 shadow-sm h-[239px]";



export default function AnalyticsWeb() {
  const theme = useTheme();
  type FilterType = "weeks" | "months" | "days";
  const [filterType, setFilterType] = useState<FilterType>("weeks");
  const { session } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLiters, setTotalLiters] = useState(0);
  const [minProductionTime, setMinProductionTime] = useState<number>(0);
  const [maxProductionTime, setMaxProductionTime] = useState<number>(0);

  console.log("min time", minProductionTime);
  console.log("max time", maxProductionTime);
  const legend = [
    { label: "SUCCESSFUL", frontColor: "#C8BB2A" },
    { label: "FAILED", frontColor: "#E5CA7D" },
    { label: "UNFINISHED", frontColor: "#E5E2BB" },
  ];

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      setLoading(true);

      const convertTimeToSeconds = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      };

      const today = new Date();
      let filterDate = new Date(today);

      if (filterType === "days") {
        filterDate.setDate(today.getDate() - 1);
      } else if (filterType === "weeks") {
        filterDate.setDate(today.getDate() - 7);
      } else if (filterType === "months") {
        filterDate.setMonth(today.getMonth() - 1);
      }

      const { data: fetchedData, error } = await supabase
        .from("datalogs")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("created_at", filterDate.toISOString())
        .order("created_at", { ascending: false });

      // Calculate total oil volume
      const totalLiters = fetchedData?.reduce(
        (acc, curr) => acc + (curr?.oil_volume ?? 0),
        0
      );
      setTotalLiters(Number(Number(totalLiters).toFixed(2)));

      // Convert production_time to seconds
      const productionTimesInSeconds = fetchedData
        ?.map((f) =>
          f.production_time ? convertTimeToSeconds(f.production_time) : null
        )
        .filter((f) => f !== null) as number[]; // Ensure valid numbers

      // Get min and max production times
      const minProductionTime =
        productionTimesInSeconds.length > 0
          ? Math.min(...productionTimesInSeconds)
          : 0;
      const maxProductionTime =
        productionTimesInSeconds.length > 0
          ? Math.max(...productionTimesInSeconds)
          : 0;

      setMinProductionTime(minProductionTime);
      setMaxProductionTime(maxProductionTime);

      if (error) console.error("Error fetching data:", error);

      setData(fetchedData || []);
      setLoading(false);
    };

    fetchData();
  }, [filterType, session]);

  // Compute Total Values
  const VALUES = {
    SUCCESSFUL: data.filter((item) => item.status === "SUCCESSFUL").length,
    FAILED: data.filter((item) => item.status === "FAILED").length,
    UNFINISHED: data.filter((item) => item.status === "UNFINISHED").length,
  };

  // Generate Stack Data for Bar Chart
  const stackData = [
    {
      stacks: [
        { value: VALUES.SUCCESSFUL, color: legend[0].frontColor },
        { value: VALUES.FAILED, color: legend[1].frontColor },
        { value: VALUES.UNFINISHED, color: legend[2].frontColor },
      ],
      label: "Production",
    },
  ];

  const { width: screenWidth } = useWindowDimensions();

  console.log("selected", filterType);

  console.log("TOTAL liters", totalLiters);

  return (
    <View
      className="w-full h-full min-h-screen"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full h-auto max-h-screen px-4 pb-4 md:px-6 lg:px-8"
      >
        <View className="flex items-start justify-center w-full mt-4 lg:items-center">
          {/**Bar chart */}
          <View className="flex flex-col items-start justify-center w-auto max-w-full gap-6 mt-6">
            <div className="flex flex-row justify-between w-full">
              <Text
                className="mt-8 font-medium md:text-lg xl:text-2xl"
                style={{ color: theme?.colors.gray }}
              >
                Total Production
              </Text>

              <div className="flex flex-col items-center lg:flex-row gap-7">
                {/**legend */}
                <div className="flex flex-row items-center justify-center gap-3">
                  <div className="flex flex-row items-center justify-center gap-1">
                    <div className="size-3 bg-[#C8BB2A] rounded-full" />
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme?.colors.text }}
                    >
                      Finished
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-1">
                    <div className="size-3 bg-[#E5CA7D] rounded-full" />
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme?.colors.text }}
                    >
                      Unfinished
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-1">
                    <div className="size-3 bg-[#E5E2BB] rounded-full" />
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme?.colors.text }}
                    >
                      Failed
                    </p>
                  </div>
                </div>
                {/**toggle */}

                <Select
                  value={filterType}
                  onValueChange={(value: FilterType) => setFilterType(value)}
                >
                  <SelectTrigger
                    className="cursor-pointer min-w-[80px] max-w-[100px]"
                    style={{ color: theme?.colors.text }}
                  >
                    <SelectValue placeholder="Week" defaultChecked />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Filter</SelectLabel>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <Text style={{ color: theme?.colors.text }}>Loading...</Text>
            ) : (
              <BarChart
                height={380}
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
                width={
                  screenWidth < 900 ? screenWidth - 400 : screenWidth - 500
                }
                noOfSections={4}
                maxValue={Math.max(
                  VALUES.SUCCESSFUL,
                  VALUES.FAILED,
                  VALUES.UNFINISHED,
                  500
                )}
                stackData={stackData}
                spacing={screenWidth < 900 ? 20 : 50}
                isAnimated
                animationDuration={2000}
                barWidth={70}
              />
            )}
          </View>
        </View>

        <View className="flex flex-col items-center gap-16 mt-16 justify-evenly">
          {/**min, max production, oil volume */}

          <View className="flex-row gap-4 md:gap-6 lg:gap-8">
            <View className={cardContainerStyle}>
              <View className="items-center w-full">
                <View className="flex-col gap-2">
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

                  <View className="flex-row items-center justify-between w-full">
                    <Text className="font-bold text-[27px] text-[#70761D]">
                      {formatTime(minProductionTime)}
                    </Text>
                    <Image
                      source={require("../../assets/images/line-graph.png")}
                      style={{
                        width: 120,
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
                <View className="flex-col gap-2">
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
                      {formatTime(maxProductionTime)}
                    </Text>
                    <Image
                      source={require("../../assets/images/line-graph-red.png")}
                      style={{
                        width: 120,
                        height: 115,
                      }}
                      contentFit="contain"
                    />
                  </View>
                </View>
              </View>
            </View>

            <View className={cardContainerStyle}>
              <View className="flex items-center w-full">
                <View className="flex-col gap-2">
                  <Text
                    className="font-normal text-[12px]"
                    style={{ color: theme?.colors.gray }}
                  >
                    Oil volume
                  </Text>
                  <Text
                    className="font-bold text-[16px]"
                    style={{ color: theme?.colors.text }}
                  >
                    Total used oil
                  </Text>

                  <View className="flex-row items-center justify-between w-full">
                    <Text className="font-bold text-[27px] text-[#22546F]">
                      {totalLiters} Liters
                    </Text>
                    <Image
                      source={require("../../assets/images/oil.png")}
                      style={{
                        width: 100,
                        height: 85,
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
                You saved Carbon footprint (CO₂e) of
              </Text>
              <Text className="font-bold text-center text-[64px] text-[#DDA01C]">
                {/** Formula: used oil litres × 1.8 = kg CO₂e saved */}
                0kg
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
