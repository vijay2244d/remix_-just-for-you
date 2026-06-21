import { create } from 'zustand';

interface AppStore {
  isEnvelopeOpen: boolean;
  setEnvelopeOpen: (open: boolean) => void;
  isUnlocked: boolean;
  setUnlocked: (unlocked: boolean) => void;
  zoomedImage: string | null;
  setZoomedImage: (src: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isEnvelopeOpen: false,
  setEnvelopeOpen: (open) => set({ isEnvelopeOpen: open }),
  isUnlocked: false,
  setUnlocked: (unlocked) => set({ isUnlocked: unlocked }),
  zoomedImage: null,
  setZoomedImage: (src) => set({ zoomedImage: src }),
}));
