import { createSlice } from '@reduxjs/toolkit';
import type PodPageModel from 'src/javascripts/models/PodPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceStampCardsAssociatedWithPodState {
    data: PodPageModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const sliceStampCardsAssociatedWithPod = createSlice({
    name: 'stampCardsAssociatedWithPod',
    initialState: {
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISliceStampCardsAssociatedWithPodState, action: { payload: PodPageModel[] }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISliceStampCardsAssociatedWithPodState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceStampCardsAssociatedWithPodState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const sliceStampCardsAssociatedWithPodActions = sliceStampCardsAssociatedWithPod.actions;
export default sliceStampCardsAssociatedWithPod;
