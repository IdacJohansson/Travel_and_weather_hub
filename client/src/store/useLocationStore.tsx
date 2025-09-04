import { create } from "zustand";

interface Location {
    latitude: number;
    longitude: number;
}

interface LocationState {
  location: Location | null;
  address: string;
  setLocation: (location: Location) => void;
  setAddress: (address: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  address: "",
  setLocation: (location) => {
    set({ location });
  },
  setAddress: (address) => {
    set({ address });
  },
}));