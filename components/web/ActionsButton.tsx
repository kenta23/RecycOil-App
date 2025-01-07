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
 
export function ActionsButton () { 
    const theme = useTheme();
   
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
           <SheetContent>
             <SheetHeader>
               <SheetTitle>Edit profile</SheetTitle>
               <SheetDescription>
                 Make changes to your profile here. Click save when you're done.
               </SheetDescription>
             </SheetHeader>
             <div className="grid gap-4 py-4">Hello</div>
             <SheetFooter>
               <SheetClose asChild>
                 <button>Submit</button>
               </SheetClose>
             </SheetFooter>
           </SheetContent>
         </Sheet>

         <AlertDialog>
           <AlertDialogTrigger>
             <AntDesign name="delete" size={24} color="#A30D11" />
           </AlertDialogTrigger>
           <AlertDialogContent
             style={{ backgroundColor: theme.colors.background }}
           >
             <AlertDialogHeader>
               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
               <AlertDialogDescription>
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
