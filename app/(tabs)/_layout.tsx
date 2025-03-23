import { View, Text, Pressable, Modal, TouchableOpacity, StyleSheet, FlatList, Platform, TouchableWithoutFeedback, Alert } from 'react-native'
import { Image } from 'expo-image';
import React, { useState } from 'react'
import { Redirect, Tabs, useRouter,  } from 'expo-router'
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useAuth } from '@/providers/authprovider'
import { supabase } from '@/lib/supabase'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import BackButton from '@/components/backbutton'
import { useTheme } from '@/providers/themeprovider'

const linkStyles = 'flex flex-row group hover:bg-primaryColor hover:text-white transition-all ease-out duration-200 items-center gap-2 py-3 px-4';

const links = [
  {
    id: 1,
    icon: (props: any) => (
      <MaterialIcons
        color={Platform.OS !== "web" ? "#BFEC87" : ""}
        {...props}
        className="group-hover:text-white text-[#BFEC87]"
        name="dashboard"
        size={26}
      />
    ),
    navigationName: "index",
    name: "Dashboard",
  },
  {
    id: 2,
    icon: (props: any) => (
      <MaterialCommunityIcons
        color={Platform.OS !== "web" ? "#BFEC87" : ""}
        {...props}
        name="timetable"
        size={26}
        className="group-hover:text-white text-[#BFEC87]"
      />
    ),
    navigationName: "datalogs",
    name: "Data logs",
  },
  {
    id: 3,
    icon: (props: any) => (
      <Ionicons
        color={Platform.OS !== "web" ? "#BFEC87" : ""}
        name="analytics-sharp"
        {...props}
        size={26}
        className="group-hover:text-white text-[#BFEC87]"
      />
    ),
    navigationName: "analytics",
    name: "Analytics",
  },
  {
    id: 4,
    icon: (props: any) => (
      <MaterialCommunityIcons
        color={Platform.OS !== "web" ? "#BFEC87" : ""}
        {...props}
        name="account"
        size={26}
        className="group-hover:text-white text-[#BFEC87]"
      />
    ),
    navigationName: "account",
    name: "Account",
  },
  {
    id: 5,
    icon: (props: any) => (
       <AntDesign name="logout" size={24}  className="group-hover:text-white text-[#BFEC87]"  color={Platform.OS !== "web" ? "#BFEC87" : ""}
       {...props} />
    ),
    name: "Sign out",
  }
];



function TabBarBackground (props: BottomTabBarProps) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const openDrawer = () => setDrawerVisible(true);
    const closeDrawer = () => setDrawerVisible(false);
    const [showWebAlert, setShowWebAlert] = useState<boolean>(false);
    const theme = useTheme();
    


    const handleTabClicked = (item : typeof links[number]) => {
      item.id !== 5 &&
        item.navigationName &&
        props.navigation.navigate(item.navigationName);
        closeDrawer();

      if (item.id === 5) {
        if (Platform.OS === "web") {
          setShowWebAlert(true);
        } else {
          Alert.alert("Sign out", "Are you sure you want to sign out?", [
            {
              text: "Yes",
              onPress: () => {
                closeDrawer();
                supabase.auth.signOut();
              },
            },
            {
              text: "No",
            },
          ]);
        }
      }
    }

    return (
      <>
    {Platform.OS === "web" ? (
      <View className="relative py-2 h-full w-[220px] min-h-svh bg-dark">
        <Image
          source={require("../../assets/images/logo-white.png")}
          style={{
            width: 150,
            height: 50,
          }}
          contentFit='contain'
        />

        <View className="mt-40">
          <FlatList
            data={links}
            accessibilityLabel="Links"
            horizontal={false}
            contentContainerStyle={{ gap: 20 }}
            renderItem={({ item }) => {
              const isActivelink =
                item.navigationName ===
                props.state.routeNames[props.state.index];
                
              return (
                <AlertDialog open={showWebAlert}>
                  <AlertDialogTrigger asChild>
                    <TouchableOpacity
                      className={linkStyles}
                      style={
                        isActivelink
                          ? {
                              backgroundColor: "#A7B891",
                              borderRadius: 17,
                            }
                          : {}
                      }
                      onPress={() => handleTabClicked(item)}
                    >
                      {item.icon({
                        style: isActivelink ? { color: "#fff" } : {},
                      })}
                      <Text
                        className="text-primaryColor group-hover:text-white text-[18px]"
                        style={isActivelink ? { color: "#fff" } : {}}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  </AlertDialogTrigger>

                  <AlertDialogContent style={{ backgroundColor: theme?.colors.background, color: theme?.colors.text,  }}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Sign out
                      </AlertDialogTitle>
                      <AlertDialogDescription style={{ color: theme?.colors.gray }}>
                         Are you sure you want to sign out?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel style={{ color: theme?.colors.text, backgroundColor: theme?.dark ? '#3e3e3e' : '#f4f3f4' }} onClick={() => setShowWebAlert(false)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => supabase.auth.signOut()} className='bg-red-500 hover:bg-red-200'>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
    ) : (
      <View className="absolute bottom-5 left-3">
        <Pressable
          className={`${drawerVisible ? "hidden" : "block"}`}
          onPress={openDrawer}
        >
          <Image
            source={require("../../assets/images/menu.png")}
            style={{ width: 65, height: 65, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
            aria-label="Menu button image"
            contentFit="contain"
            alt="Menu button icon"
            className="drop-shadow-lg"
          />
        </Pressable>

        {/* Drawer Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={drawerVisible}
          onRequestClose={closeDrawer}
        >
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <View style={styles.drawerContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.drawerContent}>
                  {/* Add your links here */}
                  <FlatList
                    data={links}
                    accessibilityLabel="Links"
                    horizontal={false}
                    style={{ height: 100 }}
                    contentContainerStyle={{ gap: 20 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className={linkStyles}
                        hitSlop={8}
                        onPress={() => handleTabClicked(item)}
                      >
                        {item.icon({ style: {} })}
                        <Text
                          className={`text-primaryColor`}
                          style={{ fontSize: 22 }}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />

                  {/* Close Button */}
                  <TouchableOpacity onPress={closeDrawer}>
                    <Feather name="x" size={55} color="white" />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    )}
      </>
  ); 
 }

export default function Tablayout() {
  const router = useRouter();
  const { session } = useAuth();
  
   if (!session?.user) { 
     return <Redirect href={'/(auth)'}/>
   }

 

  return (
    <Tabs
      screenOptions={{
        headerShown: Platform.OS === 'web' ? false : true,
        headerStyle: {
          backgroundColor: "#C8EDA3",
        },
        headerBackButtonDisplayMode: "minimal",
        tabBarPosition: 'left',
      }}
      tabBar={(props) => <TabBarBackground {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerTitleAlign: "center",
          headerTintColor: "#00000",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="datalogs"
        options={{
          title: "Data Logs",
          headerTitleAlign: "center",
          headerLeft: () => BackButton(),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          headerTitleAlign: "center",
          headerLeft: () => BackButton(),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerTitleAlign: "center",
          headerLeft: () => BackButton(),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
    drawerContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
    drawerContent: {
      borderRadius: 10,
      padding: 8,
      width: 'auto',
      height: 460,
      alignItems: 'flex-start',
      marginVertical: 20,
      marginLeft: 8
    },

    closeButton: {
      fontSize: 16,
      color: 'red',
      marginTop: 30,
    },
  });