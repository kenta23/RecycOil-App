import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, ScrollView } from "react-native";
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
import { useTheme } from "@/providers/themeprovider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Row } from "@tanstack/react-table";
import { DataInfo, progressData } from "@/lib/data";
import SkiaComponent from "@/skia components/tank-container";
import { ProgressChart } from "react-native-chart-kit";
import { useState } from "react";
 


export function ActionsButton ({ row }: { row: Row<DataInfo> }) { 
    const theme = useTheme();
    const [editing, setEditing] = useState<boolean>(false);

    {/** use row prop to ge single data from table */}
   
     return (
       <div className="flex flex-row items-center justify-center gap-4">
         {/** Edit */}
         {/** Show Edit Sheet */}
         <Sheet>
           <SheetTrigger className="cursor-pointer" asChild>
             <button className="cursor-pointer">
               <Feather name="edit" size={24} color="#6D8A49" />
             </button>
           </SheetTrigger>
           <SheetContent
             style={{
               backgroundColor: theme?.colors.background,
             }}
           >
             <SheetHeader>
               <SheetTitle style={{ color: theme?.colors.text }}>
                 Viewing data
               </SheetTitle>
               <SheetDescription style={{ color: theme?.colors.gray }}>
                  Make changes to your data here. Click save when you're done.
               </SheetDescription>
             </SheetHeader>
             <ScrollView className="w-full h-screen min-h-screen">
               <div className="flex items-center justify-between w-full mt-8">
                 {/** Name and date  */}
                 <div className="flex flex-col gap-2">
                   <div className="flex flex-row items-center gap-1">
                     {/**title */}
                    {editing ? (
                      <input
                        className="rounded-lg"
                        type="text"
                        defaultValue={row.original.date}
                      /> ) : (
                        <h1 style={{ color: theme?.colors.text }} className="text-lg font-semibold">
                          {row.original.date}
                        </h1>
                      )
                    }
                     <MaterialCommunityIcons
                       name="pencil"
                       size={20}
                       color={theme?.colors.gray}
                       onPress={() => setEditing(prev => !prev)}
                     />
                   </div>

                   {/** format the date to mm/dd/yyyy */}
                   <h2 style={{ color: theme?.colors.gray }} className="font-light">
                     {row.original.date}
                   </h2>
                 </div>

                 {/** STATUS */}
                 <div className="flex flex-row items-center gap-1">
                   <h2 className="font-semibold">{row.getValue("status")}</h2>
                 </div>
               </div>

               <div className="mt-6">
                 <div className="flex flex-col items-center gap-6">
                   <div>
                     <SkiaComponent
                       height={210}
                       width={130}
                       color="#D6C890"
                       maxValue={5}
                       value={3}
                     />
                   </div>
                   <p
                     style={{ color: theme?.colors.text }}
                     className="text-lg font-medium text-center"
                   >
                     Biodiesel
                   </p>
                 </div>
               </div>

               {/** temp and production time */}
               <div className="w-full mt-4 px-7">
                 <div className="flex flex-row items-center justify-between w-full">
                   {/** temp  */}
                   <div className="flex flex-col text-[#C66243]  items-center">
                     <h3 id="temp" className="font-bold text-[25px]">
                       65°C
                     </h3>
                     <label htmlFor="temp">Max. temp</label>
                   </div>

                   {/**chunks filtered / glycerin */}

                   <div className="flex flex-col text-[#376EC2]  items-center">
                     <h3 id="chunks" className="font-bold text-[25px]">
                       75%
                     </h3>
                     <label htmlFor="chunks">Chunks filtered</label>
                   </div>
                 </div>

                 <div className="flex flex-col items-center mt-2">
                   <ProgressChart
                     data={progressData}
                     height={140}
                     strokeWidth={6}
                     radius={20}
                     width={260}
                     hideLegend={true}
                     chartConfig={{
                       labels: ["Swim", "Bike", "Run"], // optional
                       backgroundGradientFrom: "transparent",
                       backgroundGradientTo: "transparent",
                       color: (opacity = 1) => `rgba(150, 45, 255, ${opacity})`,
                       strokeWidth: 2, // optional, default 3
                       useShadowColorFromDataset: false, // optional
                     }}
                   />
                   <p
                     className="font-semibold"
                     style={{ color: theme?.colors.text, fontSize: 16 }}
                   >
                     1 hour 30 minutes
                   </p>
                 </div>
               </div>
             </ScrollView>
             <SheetFooter>
               <SheetClose asChild>
                 <button>save</button>
               </SheetClose>
             </SheetFooter>
           </SheetContent>
         </Sheet>

         <AlertDialog>
           <AlertDialogTrigger>
             <AntDesign name="delete" size={24} color="#A30D11" />
           </AlertDialogTrigger>
           <AlertDialogContent
             style={{ backgroundColor: theme?.colors.background }}
           >
             <AlertDialogHeader>
               <AlertDialogTitle style={{ color: theme?.colors.text }}>Are you absolutely sure?</AlertDialogTitle>
               <AlertDialogDescription style={{ color: theme?.colors.text }}>
                 This action cannot be undone. This will permanently delete your
                 data
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <AlertDialogAction className="bg-red-500">
                 Continue
               </AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
         </AlertDialog>
       </div>
     );
}
