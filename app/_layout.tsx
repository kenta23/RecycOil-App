import { Inter_400Regular, Inter_300Light, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../globals.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SystemBars } from 'react-native-edge-to-edge';
import AuthProvider, { useAuth } from '@/providers/authprovider';
import 'expo-dev-client';
import Themeprovider from '../providers/themeprovider';
import { Platform } from 'react-native';
import { Toaster } from '@/components/ui/sonner';


const darkMode = {
  dark: true,
  colors: {
    primary: '#BFEC87',
    background: '#141514',
    card: 'rgb(18, 18, 18)',
    text: '#FFFFFF', //white
    gray: '#EEEDEC',
    border: '#E3E3E8',
    notification: 'rgb(255, 69, 58)',
  },
};

const lightMode = {
  dark: false,
  colors: {
    primary: '#BFEC87',
    background: 'rgb(255, 255, 255)',
    card: '#C3E1CA',
    text: '#000000',
    gray: '#38362F',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  }
}


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
      <Themeprovider value={colorScheme === "dark" ? darkMode : lightMode}>
        <Stack
          screenOptions={{
            headerShown: false,   
          }}
        >
           <Stack.Screen name="(auth)" />
           <Stack.Screen name="(tabs)" />
        </Stack>

        <SystemBars hidden={false} style={colorScheme === "dark" ? 'dark' : 'light'}/>
        {Platform.OS === 'web' && <Toaster />}
    </Themeprovider>
    </AuthProvider>
  );
}
