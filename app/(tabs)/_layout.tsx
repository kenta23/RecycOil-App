import { View, Text, Image, Pressable, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect, Tabs, useRouter,  } from 'expo-router'
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

import { useAuth } from '@/lib/authprovider'
import { useTheme } from '@react-navigation/native'


const linkStyles = 'flex flex-row items-center gap-3';
const links = [
     {
         id: 1,
         icon:  <MaterialIcons name="dashboard" size={26} color="#C8EDA3" />,
         navigationName: 'index',
         name: 'Dashboard'
     },
     { 
        id: 2, 
        icon: <MaterialCommunityIcons name="timetable" size={26} color="#C8EDA3" /> ,
        navigationName: 'datalogs',
        name: 'Data logs',
     },
     {
        id: 3,
        icon: <Ionicons name="analytics-sharp" size={26} color="#C8EDA3" />,
        navigationName: 'analytics',
        name: 'Analytics'
     },
     {
        id: 4, 
        icon: <MaterialCommunityIcons name="account" size={26} color="#C8EDA3" />,
        navigationName: 'account',
        name: 'Account'
     }
]
function TabBarBackground (props: BottomTabBarProps) {
    const [drawerVisible, setDrawerVisible] = useState(false);

    const openDrawer = () => setDrawerVisible(true);
    const closeDrawer = () => setDrawerVisible(false);


    return (
      <View className="absolute bottom-5 left-3">
        <Pressable className={`${drawerVisible ? 'hidden' : 'block'}`} onPress={openDrawer}>
          <Image
            source={require("../../assets/images/menu.png")}
            width={65}
            height={65}
            aria-label='Menu button image'
            resizeMode='cover'
            alt="Menu button icon"
            className='drop-shadow-lg'
          />
        </Pressable>

        {/* Drawer Modal */}

        <Modal
          animationType="fade"
          transparent={true}
          visible={drawerVisible}
          onRequestClose={closeDrawer}
        >
          <View style={styles.drawerContainer}>
            <View style={styles.drawerContent}>
              {/* Add your links here */}

              <FlatList
                data={links}
                accessibilityLabel="Links"
                horizontal={false}
                style={{ height: 100 }}
                contentContainerStyle={{ gap: 30 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                      className={linkStyles}
                      onPress={() => { 
                        closeDrawer();
                        props.navigation.navigate(item.navigationName)
                      }   
                      }
                    >
                      {item.icon}
                      <Text className='text-[#C8EDA3]' style={{ fontSize: 22 }}>{item.name}</Text>
                    </TouchableOpacity>
              
                )}
                keyExtractor={(item) => item.id.toString()}
              />

              {/* Close Button */}
              <TouchableOpacity onPress={closeDrawer}>
                <Feather name="x" size={55} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
}

export default function Tablayout() {
  const router = useRouter();
  const user = useAuth();
  const theme = useTheme();
  


  if(!user.session && !user.user) {
    return <Redirect href={'/auth'}/>
  }

  function BackButton () { 
    return  (
     <Pressable
     onPress={() => router.back()}
     className="text-[32px] font-bold flex-row items-center gap-1"
   >
     <Ionicons name="chevron-back-outline" size={20} color="black" />
     <Text className='text-[16px]'>Back</Text>
   </Pressable>
    )
  }
  

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#C8EDA3",
        },
        headerBackButtonDisplayMode: "minimal",
      }}
      tabBar={(props) => <TabBarBackground {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerTitleAlign: "center",
          headerTintColor: theme.dark ? "black" : "white",
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
      padding: 20,
      width: 'auto',
      height: 370,
      alignItems: 'flex-start',
      marginVertical: 30,
      marginLeft: 15
    },

    closeButton: {
      fontSize: 16,
      color: 'red',
      marginTop: 20,
    },
  });