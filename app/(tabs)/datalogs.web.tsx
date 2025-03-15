import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
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
  Row,
} from "@tanstack/react-table";
import { DataInfo, Status } from '@/lib/data';
import { StatusComponent } from '@/components/web/StatusComponent';
import { ActionsButton } from '@/components/web/ActionsButton';
import { useAuth } from '@/providers/authprovider';
import { supabase } from '@/lib/supabase';
import { Database } from '@/database.types';



export default function DatalogsWeb() {
  const { session } = useAuth();

      const [data, setData] = useState<Database['public']['Tables']['datalogs']['Row'][]>([]);
      const [refresh, setRefresh] = useState(false);

      const downloadCSV = () => {
        // Convert the data array into a CSV string
        const csvString = [
          ["id", "user_id", "biodiesel", "created_at", "production_time", "status", "temperature", "carbon_footprint", "flow_rate", "oil_volume"], // Specify your headers here
          ...data.map(item => [item.id, item.user_id, item.biodiesel, item.created_at, item.production_time, item.status, item.temperature, item.carbon_footprint, item.flow_rate, item.oil_volume, ]) // Map your data fields accordingly
        ]
        .map(row => row.join(","))
        .join("\n");
    
        // Create a Blob from the CSV string
        const blob = new Blob([csvString], { type: 'text/csv' });
    
        // Generate a download link and initiate the download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'download.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };
      

     useEffect(() => {
      async function getData() {
        if (!session?.user?.id) return; // Prevent fetching if user is not logged in
        
        const { data, error } = await supabase
          .from("datalogs") 
          .select("*")
          .eq("user_id", session.user.id);
        
        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setData(data);
        }
      }
      getData();
     }, [session?.user.id,  refresh]);

    const columns = useMemo<ColumnDef<Database['public']['Tables']['datalogs']['Row']>[]>(() => [
          {
            accessorKey: 'id',
            cell: info => info.getValue(),
            header: () => <span >ID</span>,
          },
          {
            accessorKey: 'date',
            id: 'Date',
            cell: info => info.getValue(),
            header: () => <span>Date</span>,
          },
          {
            accessorKey: 'status',
            cell: info =>  <StatusComponent status={info.getValue() as Status}/>,
            header: () => 'Status',
          },
          {
            accessorKey: 'actions',  
            cell: ({ row }) => <ActionsButton setRefresh={setRefresh} row={row}/>,
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


  console.log(data);

  
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
               <button onClick={downloadCSV} className='px-3 bg-[#F9F4EC] text-dark py-1 w-auto rounded-lg'>
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
                  <tr className={`${row.index % 2 === 0 && 'bg-[#EBE9D7] text-black'}`} key={row.id}>
                    {row.getVisibleCells().map((cell, index) => (
                        <td className={`text-center py-2 ${index === 0 && 'text-black'}`}  style={{ color: row.index % 2 === 0 ? '#00000' : '#FFFFFF' }} key={cell.id}>
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

