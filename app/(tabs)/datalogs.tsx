import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { AntDesign, Entypo, Octicons } from '@expo/vector-icons'
import { useTheme } from '../providers/themeprovider';
import { DataTable,  } from 'react-native-paper';
import { Image } from 'expo-image';



export default function Datalogs() {
  const theme = useTheme();

  return (
    <ScrollView
      className="w-full h-auto"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <View className="px-4 mt-6 ">
        <View className="flex-row items-center justify-end w-full mb-3">
          <View className="flex-row items-center gap-2">
            <Pressable className="p-2 flex-row items-center gap-2 rounded-lg bg-[#F9F4EC]">
              <Text className="text-sm text-gray-500">CSV</Text>
              <Octicons name="download" size={18} color={"#6b7280"} />
            </Pressable>

            <Pressable>
              <Octicons name="filter" size={18} color={theme?.colors.text} />
            </Pressable>
          </View>
        </View>

        <View className="w-full px-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => ({
                backgroundColor: pressed ? "#F9F4EC" : "transparent",
              })}
              className="min-h-[65px] cursor-pointer rounded-full h-auto px-4 py-3 w-full"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center justify-start gap-4 ">
                  <Image
                    source={require("../../assets/images/oil_circle.png")}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: "contain",
                    }}
                    alt="oil circle icon"
                  />

                  {/** name and status */}

                  <View className="flex-col items-start gap-2">
                    <Text className="text-[20px] font-medium">204438</Text>
                    <View className="bg-[#EBF9F1] px-3 py-2 rounded-lg">
                      <Text
                        style={[
                          {
                            color: theme?.colors.text,
                            textAlign: "center",
                            fontWeight: "600",
                          },
                          styles.success,
                        ]}
                      >
                        Success
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="w-5">
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/**FOOTER ICON */}
      <View className='flex-row items-end justify-end mt-12'>
        <Image
          source={
            theme?.dark
              ? require("../../assets/images/logo-white.png")
              : require("../../assets/images/logo-black.png")
          }
          contentFit="contain"
          style={{
            width: 100,
            height: 50,
            position: "absolute",
          
            right: 10,
          }}
        />
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  success: {
    color: "#1F9254",
  },
  failed: {
    color: "#A30D11",
  },
  running: {
    color: "#DDAA1D",
  },
  headertitle: {
    color: "#ffff",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
});