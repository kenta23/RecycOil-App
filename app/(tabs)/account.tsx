import { View, Text, Pressable, TextInput, Modal, TouchableWithoutFeedback, Alert, Platform } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Paho, { Message } from 'paho-mqtt';
import { supabase } from '@/lib/supabase';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/authprovider';
import { useRouter } from 'expo-router';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useTheme } from '@/providers/themeprovider';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import OTPInput from 'react-native-otp-textinput';

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
  const theme = useTheme();
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>('');
  const [selectedCountry, setSelectedCountry] =
    useState<null | ICountry>(null);
  const [verifyOtpModal, setVerifyOtpModal] = useState<boolean>(false);
  const [verifyOtp, setVerifyOtp] = useState<string>('');
  const [phoneNumberObj, setPhoneNumberObj] = useState<null | any>(null);
  const otpInputRef = useRef<OTPInput>(null);

    const handleChangePhoneNumber = async () => { 
      try {
        //create asyncStorage to store phone number
        // eslint-disable-next-line no-unused-expressions
        setPhoneNumberObj(parsePhoneNumberFromString(newPhoneNumber, 'PH'));
        
         if (!phoneNumberObj || !phoneNumberObj.isValid()) {
          Alert.alert('Invalid phone number', 'Please enter a valid phone number.');
          return;
         }
          const { data, error } = await supabase.auth.updateUser({
            phone: phoneNumberObj.format("E.164"),
          });
     
         
             //
             setPhoneChangeModal(false);
             setVerifyOtpModal(true);
         
        } catch (error) {
          console.log(error);
          throw new Error(error as string);
        }
    }


    async function verifyOtpHandler () {
          const { data, error } = await supabase.auth.verifyOtp({ phone: phoneNumberObj.format('E.164'), token: verifyOtp, type: 'phone_change'});
          console.log(data);
          
          if (error) {
            console.log(error);
            if (Platform.OS === 'web') {
              alert(error.message);
            } else {
              Alert.alert('The code is invalid. Please try again.');
            }
            setVerifyOtp('');
            otpInputRef.current?.clear();
            return;
           }
         
          else {
            Alert.alert('Phone number has been changed.', 'Refreshing page');
            router.replace('/(tabs)');
          }
    }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: theme?.colors.background }} className="items-center justify-center w-full h-full min-h-screen">
        {/**Inputs */}
      {/* <Pressable onPress={signoutHandler}>
        <Text>Sign out</Text>
      </Pressable> */}
        <Modal
          animationType="fade"
          visible={phoneChangeModal}
          transparent
          onRequestClose={() => setPhoneChangeModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setPhoneChangeModal(false)}>
            <View  className="items-center justify-center flex-1 bg-black/80">
              <View className="bg-white rounded-lg shadow-md w-[80%] px-4 py-6 h-auto">
                <View className="flex-col items-start gap-2">
                  <View className="flex-row items-center gap-2">
                    <Text style={[{ color: theme?.colors.text }]} className="text-lg" nativeID="changePhone">
                      Change Phone Number
                    </Text>
                  </View>

                  <PhoneInput
                    defaultCountry="PH"
                    theme={theme?.dark ? "dark" : "light"}
                    phoneInputStyles={{}}
                    style={{
                      width: "100%",
                      outline: "none",
                      color: theme?.colors.text,
                      paddingHorizontal: 10,
                    }}
                    autoFocus
                    customCaret={
                      <Entypo
                        name="chevron-down"
                        size={20}
                        color={theme?.colors.text}
                      />
                    }
                    value={newPhoneNumber}
                    onChangePhoneNumber={(c) => setNewPhoneNumber(c)}
                    selectedCountry={selectedCountry}
                    onChangeSelectedCountry={(c: ICountry) =>
                      setSelectedCountry(c)
                    }
                    placeholder="Enter your phone"
                  />

                  <Pressable onPress={handleChangePhoneNumber} className="bg-green-400 mt-4 items-center justify-center h-[50px] w-full rounded-lg">
                    <Text className="text-center text-white">
                      Change phone number
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          animationType="fade"
          visible={verifyOtpModal}
          transparent
          onRequestClose={() => setVerifyOtpModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setVerifyOtpModal(false)}>
            <View className="items-center justify-center flex-1 bg-black/80">
              <View className="bg-white rounded-lg shadow-md w-[80%] px-4 py-6 h-auto">
                <View className="flex-col items-start gap-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg" nativeID="changePhone">
                      Verification Code
                    </Text>
                  </View>

                  <OTPInput
                    autoFocus
                    handleTextChange={(c) => setVerifyOtp(c)}
                    offTintColor={"#9E9C9C"}
                    keyboardType="numeric"
                    inputCount={6}
                    textInputStyle={{
                      borderRadius: 12,
                      borderWidth: 1,
                      height: 45,
                      width: 40,
                      borderColor: "#0000",
                    }}
                  />

                  <Pressable onPress={verifyOtpHandler} className="bg-[#303330] mt-4 items-center justify-center h-[50px] w-full rounded-lg">
                    <Text className="text-center text-white">
                      Verify
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View className="flex-col max-w-[550px] w-[270px] gap-2">
          <View className="flex-col items-start gap-2">
            <View className="flex-row items-center gap-2">
              <Text style={[{ color: theme?.colors.text }]} className="text-lg" nativeID="phoneNumber">
                Phone Number
              </Text>
              <Pressable
                disabled={!session?.user.phone}
                onPress={() => setPhoneChangeModal(true)}
              >
                <Text style={[{ color: theme?.colors.text }]} className="text-sm text-gray-400 underline cursor-pointer">
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
            <Text style={[{ color: theme?.colors.text }]} className="text-lg" nativeID="email">
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

          {/* <View className="flex-col items-start gap-2">
            <Text style={[{ color: theme?.colors.text }]} className="text-lg" nativeID="nickname">
              Nickname
            </Text>
            <TextInput
              defaultValue={"@"}
              className="border-gray-400 border-[1px] outline-none active:outline-none rounded-lg text-gray-400 px-2 py-2 w-full"
              aria-labelledby="nickname"
              aria-label="nickname input"
            />
          </View> */}
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