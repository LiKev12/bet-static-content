import { createSlice } from '@reduxjs/toolkit';
import type NumberOfPointsInTasksCompletedOverTimeVisualizationModel from 'src/javascripts/models/NumberOfPointsInTasksCompletedOverTimeVisualizationModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceVisualizationState {
    data: NumberOfPointsInTasksCompletedOverTimeVisualizationModel | null;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const sliceVisualization = createSlice({
    name: 'visualization',
    initialState: {
        data: null,
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(
            state: ISliceVisualizationState,
            action: { payload: NumberOfPointsInTasksCompletedOverTimeVisualizationModel },
        ) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISliceVisualizationState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceVisualizationState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const sliceVisualizationActions = sliceVisualization.actions;
export default sliceVisualization;
