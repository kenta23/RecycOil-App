import { View, Text, Pressable, TextInput, Modal, TouchableWithoutFeedback, Alert, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/authprovider';
import { useRouter } from 'expo-router';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@/providers/themeprovider';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import OTPInput from 'react-native-otp-textinput';
import { toast } from 'sonner';



export default function Account() {
  const { session } = useAuth();
  const [phoneChangeModal, setPhoneChangeModal] = useState<boolean>(false); // State to control the modal visibility [setPhoneChangeModal]
  const router = useRouter();

  const theme = useTheme();
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [verifyOtpModal, setVerifyOtpModal] = useState<boolean>(false);
  const [verifyOtp, setVerifyOtp] = useState<string>('');
  const [phoneNumberObj, setPhoneNumberObj] = useState<null | any>(null);
  const otpInputRef = useRef<OTPInput>(null);


    const handleChangePhoneNumber = async () => { 
      try {
        setPhoneNumberObj(parsePhoneNumberFromString(newPhoneNumber, 'PH')); //new phone number

         if (!phoneNumberObj || !phoneNumberObj.isValid()) {
           Alert.alert('Invalid phone number', 'Please enter a valid phone number.');
           return;
         }

          await supabase.auth.updateUser({
            phone: phoneNumberObj.format("E.164"),
          });
    
             setPhoneChangeModal(false);
             setVerifyOtpModal(true);
         
        } catch (error) {
          console.log(error);
          throw new Error(error as string);
        }
    }

    async function verifyOtpHandler () {
          const { data, error } = await supabase.auth.verifyOtp({ phone: phoneNumberObj.format('E.164'), token:verifyOtp, type: 'phone_change'});
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

    const handleResetData = async () => { 
      const resetdata = async () => {
        const { error } = await supabase
          .from("datalogs")
          .delete()
          .eq("user_id", session?.user?.id as string);

          error && toast.error(error?.message);
          toast.success("Data deleted successfully.");
          await supabase.auth.signOut();
          router.replace("/(auth)");
      
      }

       if (Platform.OS === 'web') { 
          if (confirm('Are you sure you want to delete your data?')) {
            resetdata();
          }
      }
       else {
        Alert.alert("Delete Data", "Are you sure you want to delete your data?", [
          {
            text: "Yes",
            onPress: resetdata
          },
          {
            text: "No",
          }
        ]);
       }

  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: theme?.colors.background }} className="items-center justify-center w-full h-full min-h-screen">
        <Modal
          animationType="fade"
          visible={phoneChangeModal}
          transparent
          onRequestClose={() => setPhoneChangeModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setPhoneChangeModal(false)}>
            <View  className="items-center justify-center flex-1 bg-black/80">
              <View style={{ backgroundColor: theme?.colors.background }} className="rounded-lg shadow-md w-[80%] px-4 py-6 h-auto">
                <View className="flex-col items-start gap-2">
                  <View className="flex-row items-center gap-2">
                    <Text style={[{ color: theme?.colors.text }]} className="text-lg" nativeID="changePhone">
                      Change Phone Number
                    </Text>
                  </View>

                  <PhoneInput
                    defaultCountry="PH"
                    theme={theme?.dark ? "dark" : "light"}
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

  {/**after phone number change */}
        <Modal
          animationType="fade"
          visible={verifyOtpModal}
          transparent
          onRequestClose={() => setVerifyOtpModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setVerifyOtpModal(false)}>
            <View className="items-center justify-center flex-1 bg-black/80">
              <View className="bg-white rounded-lg shadow-md w-[90%] lg:max-w-[80%] px-4 py-6 h-auto">
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
              style={{ color: theme?.colors.gray }}
            />
          </View>

          <View className="flex-col items-start gap-2">
            <Text style={[{ color: theme?.colors.text }]} className="text-lg" nativeID="email">
              Email
            </Text>
            <TextInput
              readOnly
              defaultValue={session?.user.email && session.user.email}
              style={{ color: theme?.colors.gray }}
              className="border-gray-400 border-[1px] outline-none active:outline-none rounded-lg text-gray-400 px-2 py-2 w-full"
              aria-labelledby="email"
              aria-label="email input"
            />
          </View>
        </View>

        {/**CTA's */}
        <View className="flex-col max-w-[550px] w-[270px] gap-4 mt-8">
          <Pressable onPress={handleResetData} className="px-3 w-full py-3 rounded-lg border-[#D29967] border-[1px]">
            <Text className="text-[#D29967] text-lg text-center">
              Delete Data
            </Text>
          </Pressable>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}