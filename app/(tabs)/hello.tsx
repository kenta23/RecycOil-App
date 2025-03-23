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
import { Database } from "@/database.types";
import { formatTime } from "@/lib/utils";


type LegendItem = {
  label: string;
  frontColor: string;
};

type DataLog = {
  created_at: string;
  status: "SUCCESSFUL" | "FAILED" | "RUNNING";
};

type GroupedData = {
  successful: number;
  failed: number;
  running: number;
};

type StackDataItem = {
  label: string;
  stacks: { value: number; color: string }[];
};

// Define the legend
const legend: LegendItem[] = [
  { label: "Finished", frontColor: "#C8BB2A" },
  { label: "Failed", frontColor: "#E5E2BB" },
  { label: "Running", frontColor: "#E5CA7D" },
];


export default function AnalyticsWeb() {
  const theme = useTheme();
  type FilterType = "weeks" | "months" | "days";
  const [filterType, setFilterType] = useState<FilterType>("days");
  const [loading, setLoading] = useState<boolean>(false);
  const [maxProdTime, setMaxProdTime] = useState<string>("");
  const [minProdTime, setMinProdTime] = useState<string>("");
  const { session } = useAuth();
  const [stackData, setStackData] = useState<StackDataItem[]>([]);
  const [totalUsedOil, setTotalUsedOil] = useState<number>(0);
  const [totalSavedCo2, setTotalSavedCo2] = useState<number>(0);
  
  const getMaxTime = (timeArray: string[]): string => timeArray.reduce((max, current) => (current > max ? current : max), "00:00:00");
  const getMinTime = (timeArray: string[]): string => timeArray.reduce((min, current) => (current < min ? current : min), "00:00:00");
  

  const fetchMaxProductionTime = async (): Promise<{ maxTime: string; minTime: string }> => {
    const { data, error } = await supabase
      .from("datalogs")
      .select("production_time");
  
    if (error || !data || data.length === 0) {
      console.error("Error fetching production times:", error);
      return { maxTime: "00:00:00", minTime: "00:00:00" }; // Default values
    }
  
    // Extract max and min times
    const timeArray = data.map((item) => item.production_time || "00:00:00");
    const maxTime = getMaxTime(timeArray);
    const minTime = getMinTime(timeArray);
  
    return { maxTime, minTime };
  };
  
  
  useEffect(() => {
    if (!session?.user.id) return;
  
    const fetchData = async () => {
      // Fetch Data from Supabase
      const { data, error } = await supabase
        .from("datalogs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
  
      if (error) {
        console.error("Error fetching data:", error);
        return;
      }
  
      if (data) {
        console.log("Fetched Data:", data);
        processChartData(data as DataLog[]); 

        const { maxTime, minTime } = await fetchMaxProductionTime();
        setMaxProdTime(maxTime as string);
        setMinProdTime(minTime as string);

        //for total used Oil 
        const totalUsedOil = data.reduce((total, curr) => total + (curr.flow_rate || 0), 0);
        setTotalUsedOil(totalUsedOil);

        //total saved co2 
        const totalSaved = data.reduce((total, curr) => total + (curr.carbon_footprint || 0), 0);
        setTotalSavedCo2(totalSaved);
      }
    };
  
    fetchData();
  }, [session?.user.id, filterType]);
  
  
  const processChartData = (data: DataLog[]) => {
    let groupedData: Record<string, GroupedData> = {};
  
    data.forEach((log) => {
      const date = new Date(log.created_at);
      let label: string = "";
  
      if (filterType === "days") {
        label = date.toLocaleDateString("en-US", { weekday: "short" });
      } else if (filterType === "weeks") {
        label = `Week ${getWeekNumber(date)}`;
      } else if (filterType === "months") {
        label = date.toLocaleDateString("en-US", { month: "short" });
      }
  
      if (!groupedData[label]) {
        groupedData[label] = { successful: 0, failed: 0, running: 0 };
      }
  
      // Increment values based on status
      if (log.status === "SUCCESSFUL") groupedData[label].successful += 1;
      else if (log.status === "FAILED") groupedData[label].failed += 1;
      else if (log.status === "RUNNING") groupedData[label].running += 1;
    });
  
    let labels: string[] = [];
  
    if (filterType === "days") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Fixed weekday order
    } else if (filterType === "weeks") {
      labels = Object.keys(groupedData).sort((a, b) => Number(a.split(" ")[1]) - Number(b.split(" ")[1])); // Sort week numbers
    } else if (filterType === "months") {
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; // Fixed month order
    }
  
    // Generate Stack Data
    const newStackData: StackDataItem[] = labels
      .filter((label) => groupedData[label]) // Ensure only existing labels are included
      .map((label) => ({
        label,
        stacks: [
          { value: groupedData[label].successful, color: legend[0].frontColor },
          { value: groupedData[label].failed, color: legend[1].frontColor },
          { value: groupedData[label].running, color: legend[2].frontColor },
        ],
      }));
  
    setStackData(newStackData);
  };
  
  
  // Helper Function to Get Week Number
  const getWeekNumber = (date: Date): number => {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstJan.getDay() + 1) / 7);
  };

  
  console.log('max time', maxProdTime);

  const cardContainerStyle = "w-[12.5rem] md:w-[14rem] lg:w-[18rem] rounded-lg items-center justify-center px-4 py-2 border-[1px] border-[#E5E5EF] shadow-gray-300 shadow-sm h-[239px]";
  
  const { width: screenWidth } = useWindowDimensions();

  console.log("selected", filterType);


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
              width={screenWidth < 900 ? screenWidth - 400 : screenWidth - 500}
              noOfSections={4}
              maxValue={500}
              stackData={stackData}
              spacing={screenWidth < 900 ? 20 : 50}
              isAnimated
              animationDuration={2000}
              barWidth={70}
            />
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
                      {minProdTime}
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
                      {maxProdTime}
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
                      {totalUsedOil} liters
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
                {totalSavedCo2} kg
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
