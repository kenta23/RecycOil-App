import { clsx, type ClassValue } from "clsx"
import { ProgressChartData } from "react-native-chart-kit/dist/ProgressChart";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (milliseconds: number | null) => {
  if (!milliseconds || milliseconds <= 0) return "0hr 0min"; // Handle null or invalid cases

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}hr ${minutes}min`;
};


export const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", { 
        month: "long", 
        day: "2-digit", 
        year: "numeric" 
      }).format(date);
    };
    

  //format milliseconds to hours, minutes, and seconds 
 export const formatMsToHMS = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000) || 0;
    const hours = Math.floor(totalSeconds / 3600) || 0;
    const minutes = Math.floor((totalSeconds % 3600) / 60) || 0;
    const seconds = totalSeconds % 60 || 0;

    return {
      hours,
      minutes,
      seconds
    }
};

export function formatTimeStr (milliseconds: number) { 
  const { hours, minutes, seconds } = formatMsToHMS(milliseconds);
  return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
 }


export function timeProgressFormat (milliseconds: number): ProgressChartData {
    const { hours, minutes, seconds } = formatMsToHMS(milliseconds);

    console.log(hours, minutes, seconds);
    return { 
      labels: ['Hours', 'Minutes', 'Seconds'],
      data:  [hours, minutes, seconds].map(val => val === 1 ? 1 : val / 60), //max is 1 min is 0
      colors: ['#DB2777', '#DB2777', '#DB2777']
    };

 } 