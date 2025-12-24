import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskDTO } from '@/app/types/task';

interface TaskState {
    task: TaskDTO | null
    isLoading: boolean
}

const initialState: TaskState = {
    task: null,
    isLoading: false
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTask: (state, action: PayloadAction<TaskDTO>) => {
            state.task = action.payload;
        },
        setTaskOptimistic: (state, action: PayloadAction<TaskDTO>) => {
            state.task = action.payload;
        },
        confirmTask: (state, action: PayloadAction<TaskDTO>) => {
            state.task = action.payload;
        },
        clearTask: (state) => {
            state.task = null;
        }
    }
});

export const { setTask, setTaskOptimistic, confirmTask, clearTask } = taskSlice.actions;
export default taskSlice.reducer;