import { View, Text, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function OTPVerification() {
    const [phone, setPhone] = useState('');

    async function getPhoneNumber() { 
       try {
       const storeData = Platform.OS === 'web' ? localStorage.getItem('phone') : await AsyncStorage.getItem('phone');
         if (storeData !== null) {
          console.log(storeData);
           setPhone(storeData);
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
   })
  
  // async function handleSignInWithOTP () {
  //   const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms'})
  // }

  return (
    <View>
      <Text>hello world: {phone}</Text>
    </View>
  )
}