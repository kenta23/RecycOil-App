import { Status } from "@/lib/data"

export function StatusComponent ({ status }: { status: Status }) {
  switch(status) { 
    case Status.SUCCESSFUL: 
      return (
         <div className='flex items-center justify-center'>
           <div className='px-3 py-2 max-w-[120px] rounded-full max-w-auto bg-[#EBF9F1]'>
             <p className='text-[#1F9254] font-medium'>{status}</p>
          </div>
         </div>
      ) 
    case Status.FAILED: 
    return (
      <div className='flex items-center justify-center'>
       <div className='px-3 py-2 rounded-full max-w-[120px] bg-[#FBE7E8]'>
          <p className='text-[#A30D11] font-medium'>{status}</p>
       </div>
      </div>
   ) 
    case Status.RUNNING: 
     return (
      <div className='flex items-center justify-center'>
        <div className='px-3 py-2 rounded-full max-w-[120px] bg-[#FEF2E5]'>
            <p className='text-[#CD6200] font-medium'>{status}</p>
        </div>
      </div>
     ) 
  } 
}