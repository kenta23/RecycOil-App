import { View, Text, Pressable, TextInput, Modal, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import Paho, { Message } from 'paho-mqtt';
import { supabase } from '@/lib/supabase';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/authprovider';
import { useRouter } from 'expo-router';



export default function Account() {
  const [text, setText] = useState("");
  const { session } = useAuth();
  const [phoneChangeModal, setPhoneChangeModal] = useState<boolean>(false); // State to control the modal visibility [setPhoneChangeModal]
  const router = useRouter();


  // Initialize the MQTT client
  const client = useMemo(() => new Paho.Client("ws://test.mosquitto.org:8081/mqtt", ""), []); //websocket protocol

  // useEffect(() => {
  //   // Set up the client and connect
  //   client.onConnectionLost = (responseObject) => {
  //     if (responseObject.errorCode !== 0) {
  //       console.log("Connection lost:", responseObject.errorMessage);
  //     }
  //   };

  //   client.onMessageArrived = (message) => {
  //     console.log("Message arrived:", message.payloadString);
  //     setText(message.payloadString);
  //   };

  //   client.connect({
  //     onSuccess: () => {
  //       console.log("Connected to MQTT broker");
  //       client.subscribe("mytopic/test");
  //       console.log("Subscribed to topic: mytopic/test");
  //     },
  //     onFailure: (err) => console.log("Connection failed", err.errorMessage),
  //     useSSL: true,
  //   });

  //   return () => {
  //     if (client.isConnected()) {
  //       client.disconnect();
  //     }
  //   };

  // }, [client]);


  const twoOptionAlertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      'Hello',
      //body
      'I am two option alert. Do you want to cancel me ?',
      [
        { text: 'Yes', onPress: () => console.log('Yes Pressed') }, //redirect to change new number page
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };


  const signoutHandler = async () => {
    try {
      if(!session?.access_token) { 
         router.replace('/(auth)')
      }
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign-out failed:', error.message);
      } else {
        console.log('Signed out successfully');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  console.log(session?.user);
  return (
    <SafeAreaProvider>
      <View className='bg-slate-400 h-[50px] w-full'>
            <Pressable className='bg-slate-800' onPress={signoutHandler}><Text>Sign out</Text></Pressable>
      </View>
      
      <SafeAreaView className="items-center justify-center w-full h-full min-h-screen">
        {/**Inputs */}
        <View className="flex-col max-w-[550px] w-[270px] gap-2">
          <View className="flex-col items-start gap-2">
             <View className='flex-row items-center gap-2'>
              <Text className="text-lg" nativeID="phoneNumber">
                Phone Number 
            </Text>

               <Pressable onPress={twoOptionAlertHandler}>
                 <Text
                 
                  className="text-sm text-gray-400 underline cursor-pointer"
                >
                  Change
                </Text>
               </Pressable>
           
             </View>
            <TextInput
              readOnly
              defaultValue={session?.user.phone && session.user.phone}
              className="border-gray-400 border-[1px] outline-none active:outline-none rounded-lg px-2 py-2 w-full"
              aria-labelledby="phoneNumber"
              aria-label="phone number input"
            />
          </View>

          <View className="flex-col items-start gap-2">
            <Text className="text-lg" nativeID="email">
              Email
            </Text>
            <TextInput
              readOnly
              defaultValue={session?.user.email && session.user.email}
              className="border-gray-400 border-[1px] outline-none active:outline-none rounded-lg text-gray-400 px-2 py-2 w-full"
              aria-labelledby="email"
              aria-label="email input"
            />
          </View>

          <View className="flex-col items-start gap-2">
            <Text className="text-lg" nativeID="nickname">
              Nickname
            </Text>
            <TextInput
              defaultValue={"@"}
              className="border-gray-400 border-[1px] outline-none active:outline-none rounded-lg text-gray-400 px-2 py-2 w-full"
              aria-labelledby="nickname"
              aria-label="nickname input"
            />
          </View>
        </View>

        {/**CTA's */}

        <View className="flex-col max-w-[550px] w-[270px] gap-4 mt-8">
          <Pressable className="px-3 w-full py-3 rounded-lg border-[#D29967] border-[1px]">
            <Text className="text-[#D29967] text-lg text-center">
              Reset Data
            </Text>
          </Pressable>

          <Pressable className="px-3 w-full py-3 rounded-lg bg-[#D83E3E]">
            <Text className="text-lg text-center text-white">
              Delete Account
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}