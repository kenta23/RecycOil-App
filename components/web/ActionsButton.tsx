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
import { useEffect, useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from "@/providers/authprovider";
import { supabase } from "@/lib/supabase";

type Datalog = {
  id: number;
  flow_rate: number;
  oil_volume: number | null;
  producing_rate: number | null;
  production_time: string | null;
  temperature: number | null;
  user_id: string;
  created_at: string;
  biodiesel: string;
  name: string;
  status: string;
  carbon_footprint: number;
};

export function ActionsButton ({ row }: { row: Row<DataInfo> }) { 
    const theme = useTheme();
    const [editing, setEditing] = useState<boolean>(false);
    const [values, setValues] = useState<Datalog[]>([]);

    //fetch data
    const { session } = useAuth();
    

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
          setValues(data);
        }
      }
      getData();
    }, [session]);


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
          {values.map(item => (
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

             <ScrollView showsVerticalScrollIndicator={false} className="w-full h-full min-h-screen ">
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
                       maxValue={5 * parseFloat(item.biodiesel)}
                       value={3 * parseFloat(item.biodiesel)}
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
                       {item.temperature}C
                     </h3>
                     <label htmlFor="temp">Max. temp</label>
                   </div>

                   {/**chunks filtered / glycerin */}

                   <div className="flex flex-col text-[#376EC2]  items-center">
                     <h3 id="chunks" className="font-bold text-[25px]">
                       {item.flow_rate}
                     </h3>
                     <label htmlFor="chunks">Flow/min</label>
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
                     {item.production_time}
                   </p>
                 </div>


                 <div className="w-full h-40 px-6 my-10 space-y-2">
                   <p
                     style={{ color: theme?.colors.text }}
                     className="text-lg font-medium text-center"
                   >
                     Carbon saved
                   </p>


                     <div className="flex flex-row items-center justify-center gap-3">
                       <FontAwesome name="leaf" size={22} color="#15D037" />
                       <p style={{ color: '#15D037' }} className="text-md md:text-xl">{item.carbon_footprint} kg of CO<sub>2</sub> saved</p>
                     </div>
                 </div>
               </div>
             </ScrollView>
             <SheetFooter>
               <SheetClose asChild>
                 <button>save</button>
               </SheetClose>
             </SheetFooter>
           </SheetContent>
          ))} 
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
