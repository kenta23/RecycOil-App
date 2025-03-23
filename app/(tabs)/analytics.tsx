import { View, Text, ScrollView, Platform, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { Image } from "expo-image";
import { useTheme } from "@/providers/themeprovider";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/authprovider";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


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

type FilterType = "weeks" | "months" | "days";

// Define the legend
const legend: LegendItem[] = [
  { label: "Finished", frontColor: "#C8BB2A" },
  { label: "Failed", frontColor: "#E5E2BB" },
  { label: "Running", frontColor: "#E5CA7D" },
];


export default function Analytics() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const isWeb = Platform.OS === "web";
   const theme = useTheme();
    const [filterType, setFilterType] = useState<FilterType>("days");
    const [items, setItems] = useState<{ label: string; value: string }[]>([
      { label: 'Days', value: 'days' },
      { label: 'Weeks', value: 'weeks' },
      { label: 'Months', value: 'months' },
    ]);
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
    
    useEffect(() => { 
       switch(value) {
           case 'days': 
           setFilterType('days');
           break;
           case 'weeks':
            setFilterType('weeks');
            break;
          case 'months': 
            setFilterType('months');
             break;
       }
    }, [value]);
    
    const processChartData = (data: DataLog[]) => {
      let groupedData: Record<string, GroupedData> = {};
    
      data.forEach((log) => {
        const date = new Date(log.created_at);
        let label: string = "";
    
        if (filterType === "days") {
          label = date.toLocaleDateString("en-US", { weekday: "short" });
          //for mobile dropdown 
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

    console.log('value', value);
    console.log('filter type', filterType);
    
    
    // Helper Function to Get Week Number
    const getWeekNumber = (date: Date): number => {
      const firstJan = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000));
      return Math.ceil((days + firstJan.getDay() + 1) / 7);
    };
  
    
    console.log('max time', maxProdTime);
  
    const cardContainerStyle = `${isWeb ? "w-[12.5rem]  h-[239px]" : "w-[70%] h-[190px]"} md:w-[14rem] lg:w-[18rem] rounded-lg items-center justify-center px-4 py-2 border-[1px] border-[#E5E5EF] shadow-gray-300 shadow-sm`;
    
    const { width: screenWidth } = useWindowDimensions();
  

  // const cardContainerStyle = "w-[80%] items-center justify-center px-4 py-2 border-[1px] border-[#E5E5EF] shadow-gray-300 shadow-sm h-[200px]";


  return (
    <SafeAreaView
      edges={["bottom"]}
      className="w-full h-full min-h-screen pt-2 pb-4"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        className="w-full h-auto max-h-screen-safe-offset-2"
      >
        {Platform.OS !== "web" ? (
          <View className="px-4 mt-4">
            {/**Bar chart */}
            <View className="gap-6 mt-4">
              <Text
                className="text-[22px]"
                style={{ color: theme?.colors.gray }}
              >
                Total Production
              </Text>

              <View className="flex flex-row items-center justify-end w-full gap-3">
                {/**Dropdown picker */}
                <DropDownPicker
                  listMode="SCROLLVIEW"
                  open={open}
                  value={value}
                  items={items}
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
                  theme={theme?.dark ? "DARK" : "LIGHT"}
                  containerStyle={{
                    width: 120,
                    alignSelf: "flex-end",
                  }}
                  maxHeight={180}
                  textStyle={{ color: theme?.colors.gray }}
                  placeholderStyle={{ color: theme?.colors.text }}
                />
              </View>

              <View className="flex flex-col items-end justify-end w-full px-2 gap-7">
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
                  spacing={25}
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
        ) : (
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
                width={
                  screenWidth < 900 ? screenWidth - 400 : screenWidth - 500
                }
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
        )}

        <View className={"flex-col items-center justify-center w-full gap-6 mt-10 md:flex-row"}>
          {/** Min Production Time */}
          <View
            style={{ backgroundColor: theme?.colors.background }}
            className={cardContainerStyle}
          >
            <View className="items-center w-full">
              <View className="flex-col gap-2">
                <Text
                  className="text-sm font-normal"
                  style={{ color: theme?.colors.gray }}
                >
                  Production
                </Text>
                <Text
                  className="text-base font-bold"
                  style={{ color: theme?.colors.text }}
                >
                  Min. Production Time
                </Text>

                <View className="flex-row items-center justify-between w-full">
                  <Text className="font-bold text-2xl text-[#70761D]">
                    {minProdTime}
                  </Text>
                  <Image
                    source={require("../../assets/images/line-graph.png")}
                    style={{
                      width: isWeb ? 120 : 150,
                      height: isWeb ? 100 : 115,
                    }}
                    contentFit="contain"
                  />
                </View>
              </View>
            </View>
          </View>

          {/** Max Production Time */}
          <View
            style={{ backgroundColor: theme?.colors.background }}
            className={cardContainerStyle}
          >
            <View className="items-center w-full">
              <View className="flex-col gap-2">
                <Text
                  className="text-sm font-normal"
                  style={{ color: theme?.colors.gray }}
                >
                  Production
                </Text>
                <Text
                  className="text-base font-bold"
                  style={{ color: theme?.colors.text }}
                >
                  Max. Production Time
                </Text>

                <View className="flex-row items-center justify-between w-full">
                  <Text className="font-bold text-2xl text-[#D62F19]">
                    {maxProdTime}
                  </Text>
                  <Image
                    source={require("../../assets/images/line-graph-red.png")}
                    style={{
                      width: isWeb ? 120 : 150,
                      height: isWeb ? 100 : 115,
                    }}
                    contentFit="contain"
                  />
                </View>
              </View>
            </View>
          </View>

          {/** Total Used Oil */}
          <View
            style={{ backgroundColor: theme?.colors.background }}
            className={cardContainerStyle}
          >
            <View className="items-center w-full">
              <View className="flex-col gap-2">
                <Text
                  className="text-sm font-normal"
                  style={{ color: theme?.colors.gray }}
                >
                  Oil volume
                </Text>
                <Text
                  className="text-base font-bold"
                  style={{ color: theme?.colors.text }}
                >
                  Total used oil
                </Text>

                <View className="flex-row items-center justify-between w-full">
                  <Text className="font-bold text-2xl text-[#22546F]">
                    {totalUsedOil} liters
                  </Text>
                  <Image
                    source={require("../../assets/images/oil.png")}
                    style={{
                      width: isWeb ? 100 : 150,
                      height: isWeb ? 85 : 85,
                    }}
                    contentFit="contain"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        
          {/** Carbon Footprint Saved */}
          <View className={`${isWeb ? "size-[350px]" : "size-[300px]"} justify-self-center mx-auto shadow-green-300 shadow-lg items-center justify-center rounded-full border-[1px] mt-12 border-[#65DE9D]`}>
            
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
      </ScrollView>
    </SafeAreaView>
  );
}
