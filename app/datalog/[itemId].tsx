import { View, Text, ScrollView, Alert, Modal, TextInput, Pressable } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTheme } from '@/providers/themeprovider';
import  BackButton  from '@/components/backbutton';
import { ProgressChart } from 'react-native-chart-kit';
import { progressData } from '@/lib/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SkiaComponent from '@/skia components/tank-container';
import { useAuth } from '@/providers/authprovider';
import { supabase } from '@/lib/supabase';
import { Database } from '@/database.types';
import { formatTimeStr, timeProgressFormat } from '@/lib/utils';
import * as Crypto from 'expo-crypto';


export default function DatalogsID () {
    const { itemId } = useLocalSearchParams();
    const theme = useTheme();
    const [edit, setEditing] = useState<boolean>(false);
    const { session } = useAuth();
    const [data, setData] = useState<Database['public']['Tables']['datalogs']['Row'][]>([]);
    const UUID = Crypto.randomUUID();
    console.log('Your UUID: ' + UUID);


    // const publishSSLKey = async () => {
    //   const sslKey = Crypto.getRandomBytes(16).toString(); // Generate a 32-character key
    //   console.log("Generated SSL Key:", sslKey);
    
    //   client.publish("recycoil/security/sslKey", sslKey, { qos: 1 }, (err) => {
    //     if (err) console.error("MQTT Publish Error:", err);
    //     else console.log("SSL Key Published Successfully!");
    //   });
    // };

    useEffect(() => {
            async function getData() {
              if (!session?.user?.id) return; // Prevent fetching if user is not logged in
              const { data, error } = await supabase
                .from("datalogs")  
                .select("*")
                .eq("user_id", session.user.id).eq("id", Number(itemId));
              
              if (error) {
                console.error("Error fetching data:", error.message);
              } else {
                setData(data);
              }
            }
            getData();
    }, [session?.user.id]);

  
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ backgroundColor: theme?.colors.background }}
        className="items-center justify-center w-full h-full min-h-screen"
      >
        <Stack.Screen
          name="datalog/[itemId]"
          options={{
            headerShown: true,
            title: `${data[0]?.id}`,
            headerTitleAlign: "center",
            headerTintColor: "#00000",
            headerStyle: {
              backgroundColor: "#C8EDA3",
            },
            headerLeft: () => <BackButton />,
            headerBackButtonDisplayMode: "minimal",
          }}
        />

        <Modal
          animationType="fade"
          accessibilityLabel="Edit"
          visible={edit}
          transparent
          onRequestClose={() => setEditing(false)}
          className="w-full h-full"
        >
          <View className="items-center justify-center w-full h-full bg-black/20">
            <View
              style={{ backgroundColor: theme?.colors.background }}
              className="shadow-gray-500 shadow-lg rounded-lg p-4 w-[20rem] min-h-[12rem]"
            >
              <Text
                style={{ color: theme?.colors.text }}
                className="font-semibold text-[1.3rem]"
              >
                Edit {itemId}
              </Text>
              <TextInput
                placeholder="title"
                className="border-green-400 border-[0.5px] rounded-lg p-2 mt-4"
              />

              <View className="flex-row items-center justify-end gap-3 mt-6">
                <Pressable className="bg-[#1F9254] rounded-lg py-1 px-2 min-w-14">
                  <Text className="font-semibold text-center text-white">
                    Save
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setEditing(false)}
                  className="rounded-lg border-[1px] border-[#dc2626] py-1 px-2 min-w-14"
                >
                  <Text className="font-semibold text-center text-red-600 ">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView className="w-full h-screen min-h-screen">
          <View className="flex-row items-center justify-between w-full px-4 mt-10">
            {/** Name and date  */}
            <View className="flex flex-col gap-1">
              <View className="flex flex-row items-center gap-1">
                {/**title */}
                <Text
                  style={{ color: theme?.colors.text }}
                  className="text-lg font-semibold"
                >
                  {itemId}
                </Text>

                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color={theme?.colors.gray}
                  onPress={() => setEditing(true)}
                />
              </View>

              {/** format the date to mm/dd/yyyy */}
              <Text
                style={{ color: theme?.colors.gray }}
                className="font-light"
              >
                fdf fsf
              </Text>
            </View>

            {/** STATUS */}
            <View className="flex flex-row items-center gap-1">
              <Text
                id="status"
                style={{ color: theme?.colors.text }}
                className="font-semibold"
              >
                Status:
              </Text>
              <Text nativeID="status" className="text-[#1F9254] font-semibold">
                {data[0]?.status || "Running"}
              </Text>
            </View>
          </View>

          <View className="mt-7">
            <View className="flex flex-col items-center gap-6">
              <View>
                <SkiaComponent
                  height={250}
                  width={150}
                  color="#D6C890"
                  maxValue={5}
                  value={data[0]?.biodiesel as number}
                />
              </View>
              <Text
                style={{ color: theme?.colors.text }}
                className="text-[1.4rem] font-medium text-center"
              >
                Biodiesel
              </Text>
            </View>
          </View>

          {/** temp and production time */}
          <View className="w-full px-6 mt-10">
            <View className="flex flex-row items-center w-auto justify-evenly">
              {/** temp  */}
              <View className="flex flex-col items-center">
                <Text
                  id="temp"
                  className="font-bold text-[25px] text-[#C66243] "
                >
                  {data[0]?.temperature}
                </Text>
                <Text className="text-[#C66243] " nativeID="temp">
                  Max. temp
                </Text>
              </View>

              {/**chunks filtered / glycerin */}
              {/* 
            <View className="flex flex-col items-center">
              <Text
                id="chunks"
                className="font-bold text-[25px] text-[#376EC2] "
              >
                75%
              </Text>
              <Text className="text-[#376EC2] " nativeID="chunks">
                Chunks filtered
              </Text>
            </View> */}
            </View>

            <View className="flex flex-col items-center mt-8">
              <ProgressChart
                data={timeProgressFormat(Number(data[0]?.production_time))}
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
                className="font-semibold"
                style={{ color: theme?.colors.text, fontSize: 16 }}
              >
                {formatTimeStr(Number(data[0]?.production_time)) || "0 min"}
              </Text>
            </View> 
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}