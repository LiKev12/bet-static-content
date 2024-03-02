import { createSlice } from '@reduxjs/toolkit';
import Constants from 'src/javascripts/Constants';
import type TaskModel from 'src/javascripts/models/TaskModel';

export interface ISliceTasksAssociatedWithStampState {
    data: TaskModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const sliceTasksAssociatedWithStamp = createSlice({
    name: 'tasksAssociatedWithStamp',
    initialState: {
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISliceTasksAssociatedWithStampState, action: { payload: TaskModel[] }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISliceTasksAssociatedWithStampState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceTasksAssociatedWithStampState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const sliceTasksAssociatedWithStampActions = sliceTasksAssociatedWithStamp.actions;
export default sliceTasksAssociatedWithStamp;
