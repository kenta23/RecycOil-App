import { Device } from 'react-native-ble-plx';
import { create } from 'zustand'

type ButtonStartStore = {
  buttonStart: boolean;
  setButtonStart: (start: boolean) => void;
};

type BTconnectedStore = { 
   BTconnected: Device | null;
   setBTconnected: (connected: Device) => void;
}

export const useButtonStart = create<ButtonStartStore>((set) => ({
  buttonStart: false,  
  setButtonStart: (start) => set({ buttonStart: start }), // Corrected state update
}));

export const useBTconnection = create<BTconnectedStore>((set) => ({
  BTconnected: null,
  setBTconnected: (connected) => set({ BTconnected: connected }),
}))
