import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskDTO } from '@/app/types/task';

export interface ProjectProps {
    id: number;
    color: string;
    is_favorite: boolean;
    name: string;
    parent_id: number | null;
}

interface TaskState {
    task: TaskDTO | null
    project: ProjectProps | null
    isLoading: boolean
}

const initialState: TaskState = {
    task: null,
    project: null,
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
        confirmProject: (state, action: PayloadAction<ProjectProps>) => {
            state.project = action.payload;
        },
        clearTask: (state) => {
            state.task = null;
        }
    }
});

export const { setTask, setTaskOptimistic, confirmTask, confirmProject, clearTask } = taskSlice.actions;
export default taskSlice.reducer;