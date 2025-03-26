import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Link, Redirect, useRouter } from 'expo-router'
import { Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/authprovider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  useAnimatedRef,
  useScrollViewOffset,
  useDerivedValue,
} from "react-native-reanimated";


type Step = {
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
};


export default function home() {
  const router = useRouter();
  const { session } = useAuth();

  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const offset = useScrollViewOffset(animatedRef);

  console.log(offset.get);

  const [isScrollHorizontal, setIsScrollHorizontal] =
    React.useState<boolean>(false);

  const [steps] = useState<Step[]>([
    {
      title: 'Using your used oil',
      description: 'Collect and save used oil from now on and recycle them',
      status: 'upcoming',
    },
    {
      title: 'Run the machine',
      description: 'You can run the machine via app or manually',
      status: 'completed',
    },
    {
      title: 'Monitor',
      description: 'You can monitor save the results',
      status: 'current',
    },
    {
      title: 'Your Biodiesel',
      description: 'Finally you have your own Biodiesel',
      status: 'upcoming',
    },
  ]);



  return (
    <View className="w-full h-full min-h-screen">
      <SafeAreaView edges={["bottom"]} className="w-full h-full">
        <Animated.ScrollView
          className="w-full h-auto"
          scrollEnabled
          showsVerticalScrollIndicator={false}
          ref={animatedRef}
        >
          {/**Navbar */}
          <View className={`flex flex-row z-40 items-center justify-end w-full h-16 px-4 bg-primaryColor`}>
            <View className="flex flex-row items-center gap-4">
              <Link
                className="text-lg font-medium text-white border-none outline-none"
                href={"/(tabs)"}
              >
                <Text>Dashboard</Text>
              </Link>

              <Link
                className="text-lg font-medium text-white border-none outline-none"
                href={"/(tabs)"}
                style={session?.user ? { display: 'none' } : {}}
              >
                <Text>Sign in</Text>
              </Link>
            </View>
          </View>

          {/**Heading */}

          <View className="flex items-center justify-center w-full h-auto px-8 py-2 mt-6 ">
            <View className="flex flex-col items-center w-auto h-auto gap-2">
              <Image
                source={require("../assets/images/logo-no-background.png")}
                contentFit="cover"
                style={{ width: 100, height: 100 }}
              />
              <Text className="text-4xl font-bold">RecycOil</Text>
              <Text className='text-lg text-center'>An IOT enabled machine helps you to convert your used oil into Biodiesel with ease</Text>
            </View>

            <View className="flex flex-row items-center justify-center gap-2">
              <View className="flex-row items-center justify-center">
                <Image
                  source={require("../assets/images/laptop view.png")}
                  contentFit="contain"
                  style={{ width: 300, height: 300 }}
                />
                <Image
                  source={require("../assets/images/iphone view.png")}
                  contentFit="contain"
                  style={{ width: 200, height: 250 }}
                />
              </View>
            </View>
          </View>

          {/**Machine */}

          <View className="flex flex-row items-center justify-between w-full px-5 py-4 bg-[#5e7963] mt-28">
            {/* Text Section */}
            <View className="flex-1 p-5">
              <Text className="text-2xl leading-relaxed">
                An innovative idea turns into reality. Eco-Friendly Biodiesel at
                Your Fingertips – Control It using the Website or Mobile App
              </Text>
            </View>

            {/* Image Section */}
            <View className="flex items-center flex-1">
              <Image
                source={require("../assets/images/machine.png")}
                contentFit="contain"
                style={{ width: "100%", height: 350 }}
              />
            </View>
          </View>

  {/**Steps */}
     <View className='flex items-start w-full h-auto gap-8 px-10 py-5 mt-16'>
         <Text className='text-3xl font-bold'>Using RecycOil is Easy</Text>
         
         <View>
           {steps.map((step, index) => (
             <View key={step.title} style={styles.stepWrapper}>
               {/* Connector Line */}
               {index !== steps.length - 1 && (
                 <View
                   style={[
                     styles.connector,
                     {
                       backgroundColor: "#99B263"
                     },
                   ]}
                 />
               )}

               {/* Step Content */}
               <View style={styles.stepContent}>
                 {/* Status Icon */}
                 <View style={styles.iconContainer}>
                   {step.status === "completed" ? (
                     <View style={[styles.circle, styles.completedCircle]}>
                       <FontAwesome
                         name="check-circle"
                         size={24}
                         color="#fff"
                       />
                     </View>
                   ) : step.status === "current" ? (
                     <View style={[styles.circle, styles.currentCircle]}>
                       <FontAwesome5
                         name="dot-circle"
                         size={24}
                         color="#78B544"
                       />
                     </View>
                   ) : (
                     <View style={[styles.circle, styles.upcomingCircle]}>
                       <View style={styles.dot} />
                     </View>
                   )}
                 </View>

                 {/* Step Details */}
                 <View style={styles.textContainer}>
                   <Text
                     style={[
                       styles.stepTitle,
                       step.status === "completed" && styles.completedTitle,
                       step.status === "current" && styles.currentTitle,
                       step.status === "upcoming" && styles.upcomingTitle,
                     ]}
                   >
                     {step.title}
                   </Text>
                   <Text style={styles.description}>{step.description}</Text>
                 </View>
               </View>
             </View>
           ))}
         </View>
        </View>

         <View className='flex items-center justify-center w-full gap-4 px-5 py-4 mt-16'>
               <Text className='text-2xl font-normal'>Your Waste Oil, Your Green Energy.</Text>
               <Text className='text-5xl font-bold'>Make RecycOil</Text>
          </View>

          {/**Footer */}

          <View className='flex justify-center w-full h-20 bg-[#303432] mt-24'>
              <View className='flex flex-row items-center justify-between w-full px-6'>
                  <View className='flex flex-row items-center gap-4'>
                     <FontAwesome5 name="facebook" size={24} color="white" />
                     <Entypo name="instagram-with-circle" size={24} color="white" />
                     <MaterialCommunityIcons name="gmail" size={24} color="white" />
                  </View>

                  <View>
                      <Text className='text-sm text-white'>copyright © 2025 Innov8tor</Text>
                  </View>
                
              </View>
          </View>


        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 32,
  },
  stepsContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  stepWrapper: {
    position: 'relative',
    marginBottom: 32,
  },
  connector: {
    position: 'absolute',
    left: 27,
    top: 56,
    width: 2,
    height: 64,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 24,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: '#78B544',
  },
  currentCircle: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#78B544',
  },
  upcomingCircle: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  textContainer: {
    flex: 1,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedTitle: {
    color: '#78B544',
  },
  currentTitle: {
    color: '#111827',
  },
  upcomingTitle: {
    color: '#6B7280',
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
  },
});