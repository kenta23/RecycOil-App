import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { AntDesign, Entypo, Octicons } from '@expo/vector-icons'
import { useTheme } from '../../providers/themeprovider';
import { Image } from 'expo-image';
import { Link } from 'expo-router';



export default function Datalogs() {
  const theme = useTheme();

  return (
    <View
      className="w-full min-h-screen pt-2 pb-4"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <ScrollView
        className="w-full h-auto max-h-screen-safe-offset-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
           paddingBottom: 25
          }}
      >
        <View className="gap-4 px-4 mt-6">
          <View className="flex-row items-center justify-between w-full px-3 mb-3">
            <View>
              <Text
                className="text-[22px] font-medium"
                style={[{ color: theme?.colors.text }]}
              >
                Your Data
              </Text>
            </View>
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
              <Link
                href={{
                  pathname: "/datalog/[itemId]",
                  params: { itemId: index },
                }}
                push
                key={index}
              >
                <View
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
                        <Text
                          style={{ color: theme?.colors.text }}
                          className="text-[20px] font-medium"
                        >
                          204438
                        </Text>
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
                      <AntDesign
                        name="right"
                        size={20}
                        color={theme?.colors.gray}
                      />
                    </View>
                  </View>
                </View>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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