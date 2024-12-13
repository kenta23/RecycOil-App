import React, { createContext, useContext } from 'react'


type ThemeContextProviderProps = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
} ;


const themeContext = createContext<ThemeContextProviderProps | null>(null);

export default function Themeprovider({ value, children }: { value: ThemeContextProviderProps, children: React.ReactNode }) {
  return (
     <themeContext.Provider value={value}>
        {children}
     </themeContext.Provider>
  ) 
}

export const useTheme = () => useContext<ThemeContextProviderProps | null>(themeContext);