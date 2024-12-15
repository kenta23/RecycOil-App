import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Entypo, Octicons } from '@expo/vector-icons'
import { useTheme } from '../providers/themeprovider';
import { DataTable,  } from 'react-native-paper';
import { Image } from 'expo-image';



export default function Datalogs() {
  const theme = useTheme();

  return (
    <View
      className="w-full min-h-screen"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <View className="px-4 mt-16">
        <View className="flex-row items-center justify-between w-full mb-3 bg-slate-500">
          
          <View className="flex-row items-center">
            <Pressable className="p-2 flex-row items-center gap-2 rounded-lg bg-[#F9F4EC]">
              <Text className="text-sm text-gray-500">CSV</Text>
              <Octicons name="download" size={18} color={"#6b7280"} />
            </Pressable>

            <Pressable>
              <Octicons name="filter" size={18} color={theme?.colors.text} />
            </Pressable>
          </View>
        </View>

        {/** Data logs tables here */}

          <DataTable>
            <DataTable.Header style={{ backgroundColor: theme?.colors.card }}>
              <DataTable.Title>
                  <></>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.headertitle}>ID</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text  style={styles.headertitle}>Date</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text  style={styles.headertitle}>Status</Text>
                </DataTable.Title>

            </DataTable.Header>


            <DataTable.Row>
                <DataTable.Cell>
                   <Image 
                     source={require('../../assets/images/oil_icon.png')}
                     alt='oil icon'
                     style={{ width: 25, height: 25, resizeMode: 'contain' }}
                     />
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={{ color: theme?.colors.text }}>2403</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={{ color: theme?.colors.text, textAlign: 'center' }}>2023-01-01</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                   <View className='bg-[#EBF9F1] px-3 py-2 rounded-lg'>
                    <Text style={[{ color: theme?.colors.text, textAlign: 'center', fontWeight: '600'}, styles.success]}>Success</Text>
                  </View>
                </DataTable.Cell>

            </DataTable.Row>
          </DataTable>
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
  success: {
    color: "#1F9254",
  },
  failed: {
    color: "#A30D11",
  },
  running: {
    color: "#DDAA1D",
  },
  headertitle: {
    color: "#ffff",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
});