import { View, Text, Pressable } from "react-native";
import React from "react";
import { supabase } from "@/lib/supabase";
import { Redirect } from "expo-router";

export default function analytics() {
  return (
    <View>
      <Pressable onPress={async () => {
       const { error } = await supabase.auth.signOut();

       console.log(error);
       
       if(!error) { 
         <Redirect href={'/auth'}/>
       }
      }}>
         <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}
