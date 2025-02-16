import React, { useEffect, useRef, useState } from 'react'
import { Alert, Platform, Pressable, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/authprovider';
import { Redirect, useNavigation, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { Provider } from '@supabase/supabase-js';
import { useTheme } from '../../providers/themeprovider';
import PhoneInput, {
  ICountry,
} from 'react-native-international-phone-number';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { toast } from 'sonner';

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const { session } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] =
  useState<null | ICountry>(null);
  const navigat = useNavigation();

const [phoneNumber, setphoneNumber] = useState<string>('');
console.log(phoneNumber);

function handleInputValue(phoneNumber: string) {
  setphoneNumber(phoneNumber);
}

function handleSelectedCountry(country: ICountry) {
  setSelectedCountry(country);
}
  console.log(theme);
  WebBrowser.maybeCompleteAuthSession(); // required for web only
  const redirectTo = makeRedirectUri();

  console.log(redirectTo);

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
  return data.session;
};

const performOAuth = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    console.log(url);
    await createSessionFromUrl(url);
  }
};

  async function handleSignInWithOTP () {
   try {
   //create asyncStorage to store phone number
   // eslint-disable-next-line no-unused-expressions

   const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, 'PH');

   if (!phoneNumberObj || !phoneNumberObj.isValid()) {
     if (Platform.OS === "web") {
       toast.error("Invalid phone number, Please enter a valid phone number.");
     } else {
       Alert.alert(
         "Invalid phone number",
         "Please enter a valid phone number."
       );
       return;
     }
   } else {
     const { data, error } = await supabase.auth.signInWithOtp({
       phone: phoneNumberObj.format("E.164"),
     });

     if (!error) {
       if (Platform.OS === "web") {
         localStorage.setItem("phone", phoneNumberObj.format("E.164")); //format to string
       } else {
         await AsyncStorage.setItem("phone", phoneNumberObj.format("E.164"));
       }
       router.push("/(auth)/verify");
     }
   }
   } catch (error) {
     console.log(error);
     throw new Error(error as string);
   }
}

const btncolor = "flex-row items-center justify-center w-full h-auto gap-3 py-4 rounded-lg shadow-sm border-[1px] border-gray-300 cursor-pointer"

if(session?.user) { 
  return <Redirect href="/(tabs)" />
}

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
     <SafeAreaView
      style={[styles.container, { backgroundColor: theme?.colors.background }]}
    >
      <View className="flex-col items-center gap-3 mb-10">
        <Image
          source={require("../../assets/images/logo-no-background.png")}
          style={{ width: 100, height: 100 }}
          alt="RecycOil logo"
        />
        <Text
          className="text-2xl font-semibold text-center"
          style={{
            color: theme?.colors.text,
            fontSize: Platform.OS === "web" ? 35 : undefined,
          }}
        >
          RecycOil Login
        </Text>
      </View>

      <View className="w-[30%] min-w-[300px] flex-col items-center gap-4">
        <PhoneInput
          defaultCountry="PH"
          theme={theme?.dark ? "dark" : "light"}
          style={{ width: "100%", outline: "none", color: theme?.colors.text, paddingHorizontal: 10 }}
          autoFocus
          customCaret={<Entypo name="chevron-down" size={20} color={theme?.colors.text} />} 
          value={phoneNumber}
          onChangePhoneNumber={handleInputValue}
          selectedCountry={selectedCountry}
          onChangeSelectedCountry={handleSelectedCountry}
          placeholder='Enter your phone'    
        />
      
        <Pressable onPress={ handleSignInWithOTP } className="flex-row items-center justify-center w-full h-auto gap-3 py-4 rounded-lg shadow-sm bg-[#668B38] cursor-pointer">
          <Text
            style={{ color: '#ffff' }}
            className={`text-lg text-center`}
          >
            Sign in
          </Text>
        </Pressable>
        <View className="flex-row items-center gap-2">
          <View className="w-[100px] h-[1px] bg-gray-400" />
          <Text className="text-gray-400">Or</Text>
          <View className="w-[100px] h-[1px] bg-gray-400" />
        </View>
        <Pressable
          className={btncolor}
          disabled={loading}
          onPress={() => performOAuth("google")}
        >
          <Image
            source={require("../../assets/images/google.png")}
            className="size-8"
            style={{ width: 25, height: 25 }}
            alt="google icon"
          />
          <Text
            style={{ color: theme?.colors.text }}
            className={`text-lg text-center`}
          >
            Sign in using Gmail
          </Text>
        </Pressable>

        <Pressable
          className={btncolor}
          disabled={loading}
          onPress={() => performOAuth("github")}
        >
          {theme?.dark ? (
            <Image
              source={require("../../assets/images/github-logo-white.png")}
              style={{ width: 25, height: 25 }}
              alt="github icon"
            />
          ) : (
            <Image
              source={require("../../assets/images/github-logo.png")}
              style={{ width: 25, height: 25 }}
              alt="github icon"
            />
          )}
          <Text
            style={{ color: theme?.colors.text }}
            className={`text-lg text-center`}
          >
            Sign in using Github
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  dark: {
     backgroundColor: '#0D1411',
     color: 'white',
  },
  container: {
    padding: 12,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})