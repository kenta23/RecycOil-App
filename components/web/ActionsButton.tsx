import { AntDesign, Feather } from "@expo/vector-icons";
import { Alert } from "react-native";
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
import { useTheme } from "@react-navigation/native";

export function ActionsButton () { 
    const theme = useTheme();
   
     return (
       <div className="flex flex-row items-center justify-center gap-4">
         <Feather
               name="edit"
               size={24}
               color="#6D8A49"
             />  
         <AlertDialog>
           <AlertDialogTrigger>
              <AntDesign name="delete" size={24} color="#A30D11" />
           </AlertDialogTrigger>
           <AlertDialogContent style={{ backgroundColor: theme.colors.background }}>
             <AlertDialogHeader>
               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
               <AlertDialogDescription>
                 This action cannot be undone. This will permanently delete your
                 data
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <AlertDialogAction className="bg-red-500">Continue</AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
         </AlertDialog>

       
       </div>
     );
}
