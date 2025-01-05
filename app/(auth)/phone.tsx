import { View, Text, Platform, Pressable, TouchableHighlight, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import OTPInput from 'react-native-otp-textinput';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import parsePhoneNumberFromString, { PhoneNumber } from 'libphonenumber-js';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OTPVerification() {
    const [phone, setPhone] = useState<PhoneNumber | undefined>(undefined);
    const [code, setCode] = useState('');
    const router = useRouter();
    const otpInputRef = useRef<OTPInput>(null);

    async function getPhoneNumber(): Promise<void> { 
       try {
       const storeData = Platform.OS === 'web' ? localStorage.getItem('phone') : await AsyncStorage.getItem('phone');
       console.log('from phone page', storeData);
         if (storeData !== null) {
           const formattedPhoneNumber = parsePhoneNumberFromString(storeData, 'PH');
           setPhone(formattedPhoneNumber);
          }
       } catch (error) {
        console.log(error);
        return;
       }

       return;
    }


    //ran only once
   useEffect(() => { 
     getPhoneNumber();
   }, [])
  
  async function handleSignInWithOTP () {
    if(!phone?.isValid()) { 
      Alert.alert('Invalid phone number');
      return;
    }
    const { data, error } = await supabase.auth.verifyOtp({ phone: phone.format('E.164'), token: code, type: 'sms'});
    console.log(data);

    console.log(code);
    
    if (error) {
      console.log(error);
      if (Platform.OS === 'web') {
        alert(error.message);
      } else {
        Alert.alert('The code is invalid. Please try again.');
      }
      setCode('');
      otpInputRef.current?.clear();
      return;
     }
   

    else {
      console.log(data);
      router.push('/(tabs)');
    }
  }

 async function resendSms () { 
   if (!phone) {
     Alert.alert('Phone number is not available.');
     return;
   }
   const { error } = await supabase.auth.resend({ type: 'sms', phone: phone.format('E.164') });
    Alert.alert('The code has been resent.');

    if (error) {
      Alert.alert(error.message);
      return;
    }
  }

  console.log(code);


  const handleCodeChange = (code: string) => {
    setCode(code);

    if(code.length === 6) {
      handleSignInWithOTP();
    }
  };

 
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className='flex-1'>
        <View className="items-center justify-center w-full h-full min-h-screen px-4">
          <View className="flex flex-col items-center w-full gap-8 mt-8">
            <Image
              source={require("../../assets/images/otp_verification.png")}
              style={{
                width: 180,
                height: 270,
              }}
              alt="Phone verification svg"
              contentFit="contain"
            />

            <View className="flex flex-col mt-10">
              <View className="flex-col gap-2">
                <Text className="text-[20px] font-medium text-center">
                  Verification Code
                </Text>
                <Text className="font-normal text-center text-dark">
                  Enter verification code sent to{" "}
                  <Text className="font-semibold">+639489120162</Text>
                </Text>
              </View>

              {/** Phone number input */}
              <View className="flex-col gap-4 mt-4">
                <OTPInput
                  autoFocus
                  ref={otpInputRef}
                  handleTextChange={handleCodeChange}
                  offTintColor={"#9E9C9C"}
                  keyboardType="numeric"
                  inputCount={6}
                  textInputStyle={{
                    borderRadius: 12,
                    borderWidth: 1,
                    height: 45,
                    borderColor: "#0000",
                  }}
                />

                <Pressable
                  disabled={code.length === 6}
                  onPress={handleSignInWithOTP}
                  className="w-full flex-col items-center py-5 bg-[#303330] rounded-full"
                >
                  <Text className="text-center font-semibold text-[20px] text-white">
                    Verify
                  </Text>
                </Pressable>

                <View className="flex-row justify-center ">
                  <Text>Code didn't receive? </Text>
                  <TouchableHighlight
                    onPress={resendSms}
                    underlayColor="transparent"
                  >
                    <Text className="font-semibold text-[#769E45] underline">
                      Resend
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}