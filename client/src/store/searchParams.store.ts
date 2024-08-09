import { create } from 'zustand';

type TSearchParams = { roomName?: string; userName?: string };

type TSearchParamsStore = {
  searchParams: TSearchParams;
  changeSearchParams: (newSearchParams: TSearchParams) => void;
};

export const useSearchParamsStore = create<TSearchParamsStore>()((set) => ({
  searchParams: {},
  changeSearchParams: (newSearchParams) => set(() => ({ searchParams: newSearchParams })),
}));
