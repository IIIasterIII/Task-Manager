import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  id: number;
  email: string;
  username: string;
  user_pic: string;
  first_logged_in: string;
  last_accessed: string;
}

interface UserState {
  profile: UserData | null    
  currentTab: string           
  isModalOpen: boolean
  panel_id: number | null
  isCreateProjectOpen: boolean   
  isAuthenticated: boolean; 
}

const tabs = ["inbox", "today", "upcoming", "filters"];

const initialState: UserState = {
  profile: null,
  currentTab: "inbox",
  isModalOpen: false,
  panel_id: null,
  isCreateProjectOpen: false,
  isAuthenticated: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUserData: (state, action: PayloadAction<UserData>) => {
        state.profile = action.payload
        state.isAuthenticated = true
      },
      logout: (state) => {
        state.profile = null
        state.isAuthenticated = false
      },
      setTab: (state, action: PayloadAction<number>) => {
        state.currentTab = tabs[action.payload] || "inbox"
      },
      toggleCreateProject: (state, project_id: PayloadAction<number | null>) => {
        state.isCreateProjectOpen = !state.isCreateProjectOpen
        state.panel_id = project_id.payload
      },
      toggleModal: (state, project_id: PayloadAction<number | null>) => {
        state.isModalOpen = !state.isModalOpen
        state.panel_id = project_id.payload
      }
    },
});

export const { setUserData, logout, setTab, toggleCreateProject, toggleModal } = userSlice.actions;

export default userSlice.reducer;