import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Entypo, Octicons } from '@expo/vector-icons'
import { useTheme } from '../providers/themeprovider';
import { DataTable,  } from 'react-native-paper';
export default function Datalogs() {
  const theme = useTheme();

  return (
    <View
      className="w-full min-h-screen"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <View className="px-4 mt-8">
        <View className="flex-row items-center justify-between w-full">
          <Text
            style={{ color: theme?.colors.text }}
            className="text-lg font-semibold"
          >
            Data Logs
          </Text>
          <View className="flex-row items-center gap-3">
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
            <DataTable.Header style={{ width: '100%' }}>
              <DataTable.Title>
                  <Text style={{ color: theme?.colors.text }}>ID</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={{ color: theme?.colors.text }}>Date</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={{ color: theme?.colors.text }}>Status</Text>
                </DataTable.Title>

            </DataTable.Header>


            <DataTable.Row>
                <DataTable.Cell>
                  <Text style={{ color: theme?.colors.text }}>1</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={{ color: theme?.colors.text }}>2023-01-01</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={{ color: theme?.colors.text }}>Completed</Text>
                </DataTable.Cell>

            </DataTable.Row>
          </DataTable>

        </View>
    </View>
  );
}