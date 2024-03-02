import { createSlice } from '@reduxjs/toolkit';
import Constants from 'src/javascripts/Constants';
import type TaskModel from 'src/javascripts/models/TaskModel';

export interface ISliceTasksAssociatedWithPodState {
    data: TaskModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const sliceTasksAssociatedWithPod = createSlice({
    name: 'tasksAssociatedWithPod',
    initialState: {
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISliceTasksAssociatedWithPodState, action: { payload: TaskModel[] }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISliceTasksAssociatedWithPodState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceTasksAssociatedWithPodState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const sliceTasksAssociatedWithPodActions = sliceTasksAssociatedWithPod.actions;
export default sliceTasksAssociatedWithPod;
