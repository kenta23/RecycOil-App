import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Image } from 'expo-image';
import { useTheme } from '@/providers/themeprovider';
import { AntDesign, Feather, Octicons } from "@expo/vector-icons";
import {
  useReactTable,
  Column,
  ColumnDef,
  PaginationState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DataInfo, Status } from '@/lib/data';


function ActionsButton () { 
     return ( 
        <div className='flex flex-row items-center justify-center gap-4'>
             <Feather name="edit" size={24} color="#6D8A49" />
             <AntDesign name="delete" size={24} color="#A30D11" />
        </div>
     )
}

export default function DatalogsWeb() {
    const columns = useMemo<ColumnDef<DataInfo>[]>(() => [
          {
            accessorKey: 'id',
            cell: info => info.getValue(),
            header: () => <span>ID</span>,
          },
          {
            accessorKey: 'date',
            id: 'Date',
            cell: info => info.getValue(),
            header: () => <span>Date</span>,
          },
          {
            accessorKey: 'status',
            cell: info => info.getValue(),
            header: () => 'Status',
          },
          {
            accessorKey: 'actions',
            cell: () => <ActionsButton />,
            header: () => 'Actions',
          },
        ],
        []
      )

  const theme = useTheme();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    columns,
    data: [{
         id: '1',
         date: '2023-01-01',
         status: Status.SUCCESSFUL,
    }], //fill data from the database later on
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
  })


  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: theme?.colors.background }}
    >
      <div
        style={{ color: theme?.colors.text }}
        className="w-full h-auto max-h-screen px-6 py-4 "
      >
        <h1 className="mt-8 font-medium md:text-lg xl:text-2xl">Your Data</h1>

        {/**TABLE */}
    <div className="w-full flex flex-col justify-between items-center mt-8 min-h-[500px] lg:min-h-[650px] xl:min-h-[700px]">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      <div
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr className={`${row.index % 2 === 0 && 'bg-[#EBE9D7]'}`} key={row.id}>
                    {row.getVisibleCells().map((cell, index) => {
                      return (
                        <td className={`text-center`} key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>


          {/**PAGINATION BUTTONS */}
            <div className='flex flex-row items-center gap-2'>
                {table.getPageCount() > 1 ? Array.from({ length: table.getPageCount() }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => table.nextPage()}
                        className={`px-4 py-2 rounded-lg ${table.getState().pagination.pageIndex === index ? 'bg-[#6D8A49] text-white' : 'bg-[#E0E0E0] text-black'}`}
                      
                    >
                       {index + 1}
                    </button>
                )) : Array.from({ length: 2 }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => table.nextPage()}
                        className={`px-4 py-2 rounded-lg ${table.getState().pagination.pageIndex === index ? 'bg-[#6D8A49] text-white' : 'bg-[#E0E0E0] text-black'}`}
                       
                    >
                       {index + 1}
                    </button>))}
            </div>
        </div>
      </div>
    </div>
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
