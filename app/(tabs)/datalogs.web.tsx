import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Image } from 'expo-image';
import { useTheme } from '@/providers/themeprovider';
import { AntDesign, Feather, Ionicons, Octicons } from "@expo/vector-icons";
import {
  useReactTable,
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DataInfo, Status } from '@/lib/data';
import { StatusComponent } from '@/components/web/StatusComponent';
import { ActionsButton } from '@/components/web/ActionsButton';



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
            cell: ({ row }) => <ActionsButton row={row}/>,
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
  const [data, setData] = useState<DataInfo[]>([
    {
      id: "1",
      date: "2023-01-01",
      status: <StatusComponent status={Status.SUCCESSFUL} />,
    },
  ]);

  const table = useReactTable({
    columns,
    data, //fill data from the database later on
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
  <div className="w-full flex flex-col justify-between items-center mt-8 min-h-[400px] lg:min-h-[500px] xl:min-h-[600px]">
      <div className='flex flex-col items-end w-full'>
          {/**filter and csv action button */}
           <div className='flex flex-row items-center gap-3'>
               <button className='px-3 bg-[#F9F4EC] text-dark py-1 w-auto rounded-lg'>
                   <span className='me-1'>CSV</span><Feather name="download" size={18} color="#38362F" />
               </button>

               <Ionicons name="filter" size={24} color={theme?.colors.gray} className='cursor-pointer'/>
           </div>
         <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      <div
                        className={`px-6 py-3 font-bold text-xs text-gray-500 uppercase tracking-wider`}
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
                    {row.getVisibleCells().map((cell, index) => (
                        <td className={`text-center py-2 text-black`} key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
         </div>


          {/**PAGINATION BUTTONS */}
            <div className='flex flex-row items-center gap-2'>
                {table.getPageCount() > 1 ? Array.from({ length: table.getPageCount() }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => table.nextPage()}
                        className={`px-4 py-2 rounded-lg ${!table.getCanNextPage() && 'text-gray-500'} ${table.getState().pagination.pageIndex === index ? 'bg-[#6D8A49] text-white' : 'bg-[#E0E0E0] text-black'}`}
                        disabled={!table.getCanNextPage()}
                    >
                       {index + 1}
                    </button>
                )) : Array.from({ length: 2 }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => table.nextPage()}
                        className={`px-4 py-2 rounded-lg ${!table.getCanNextPage() && 'text-gray-500'} ${table.getState().pagination.pageIndex === index ? 'bg-[#6D8A49] text-white' : 'bg-[#E0E0E0] text-black'}`}
                        disabled={!table.getCanNextPage()}
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

