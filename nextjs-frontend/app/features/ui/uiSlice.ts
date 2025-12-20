// lib/features/ui/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TabName = "inbox" | "today" | "upcoming" | "filters" | "completed" | "search";

const tabs: Record<number, TabName> = {
    0: "inbox",
    1: "today",
    2: "upcoming",
    3: "filters",
    4: "completed",
    5: "search"
};

interface UIState {
    currentTab: TabName;
    isModalOpen: boolean;
  }

const initialState: UIState = {
 currentTab: "inbox",
  isModalOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
      setTab: (state, action: PayloadAction<number>) => {
        state.currentTab = tabs[action.payload];
      },
      toggleModal: (state) => {
        state.isModalOpen = !state.isModalOpen;
      }
    },
});

export const { setTab, toggleModal } = uiSlice.actions;
export default uiSlice.reducer;