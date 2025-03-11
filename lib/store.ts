import { create } from 'zustand'

type ButtonStartStore = {
  buttonStart: boolean;
  setButtonStart: (start: boolean) => void;
};

export const useButtonStart = create<ButtonStartStore>((set) => ({
  buttonStart: false,  
  setButtonStart: (start) => set({ buttonStart: start }), // Corrected state update
}));
