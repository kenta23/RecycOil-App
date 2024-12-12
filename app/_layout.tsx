import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Inter_400Regular, Inter_300Light, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import {  Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../globals.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SystemBars } from 'react-native-edge-to-edge';
import AuthProvider from '@/lib/authprovider';
import 'expo-dev-client';
import { Image } from 'expo-image';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Regular: Inter_400Regular,
    Light: Inter_300Light,
    Medium: Inter_500Medium,
    SemiBold: Inter_600SemiBold,
    Bold: Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack 
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="auth"/>
          <Stack.Screen name="(tabs)" />     
        </Stack>


          <Image
                source={require("../assets/images/logo-no-background.png")} 
                style={{
                  width: 50,
                  height: 50,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}
              />
     
        <SystemBars style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
