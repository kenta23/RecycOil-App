import React, { useState } from 'react'
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authprovider';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { Provider } from '@supabase/supabase-js';
import { useTheme } from './providers/themeprovider';

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const { session } = useAuth();
  const theme = useTheme();

  console.log(theme);
  
  if (session) return <Redirect href="/" />;

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

  console.log(res.type);
};

const btncolor = "flex-row items-center justify-center w-full h-auto gap-3 py-4 rounded-lg shadow-sm border-[1px] border-gray-300 cursor-pointer"

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.colors.background }]}>
      <View className="flex-col items-center gap-3 mb-10">
        <Image
          source={require("../assets/images/logo-no-background.png")}
          style={{ width: 100, height: 100 }}
          alt="RecycOil logo"
        />
        <Text
          className={"text-center font-semibold text-2xl"}
          style={
            Platform.OS === "web" && {
              fontSize: 35,
              color: theme?.colors.text
            }
          }
        >
          RecycOil Login
        </Text>
      </View>

      <View className="w-[50%] min-w-[250px] flex-col items-center gap-4">
        <Pressable
          className={btncolor}
          disabled={loading}
          onPress={() => performOAuth("google")}
        >
          <Image
            source={require("../assets/images/google.png")}
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
              source={require("../assets/images/github-logo-white.png")}
              style={{ width: 25, height: 25 }}
              alt="github icon"
            />
          ) : (
            <Image
              source={require("../assets/images/github-logo.png")}
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