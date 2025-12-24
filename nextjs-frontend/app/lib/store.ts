import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../features/ui/userSlice';
import taskReducer from '../features/ui/taskSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      task: taskReducer
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];