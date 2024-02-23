import { createSlice } from '@reduxjs/toolkit';
import type PodPageModel from 'src/javascripts/models/PodPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISlicePodPageState {
    data: PodPageModel | null;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const slicePagePod = createSlice({
    name: 'pagePod',
    initialState: {
        data: null,
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISlicePodPageState, action: { payload: PodPageModel }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISlicePodPageState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISlicePodPageState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const slicePagePodActions = slicePagePod.actions;
export default slicePagePod;
