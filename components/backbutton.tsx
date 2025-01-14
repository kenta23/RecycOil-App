import { Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      className="text-[32px] font-bold flex-row items-center gap-1"
    >
      <Ionicons name="chevron-back-outline" size={20} color="black" />
      <Text className="text-[16px]">Back</Text>
    </Pressable>
  );
}
