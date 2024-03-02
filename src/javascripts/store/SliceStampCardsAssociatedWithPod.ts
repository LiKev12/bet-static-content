import { createSlice } from '@reduxjs/toolkit';
import type StampCardModel from 'src/javascripts/models/StampCardModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceStampCardsAssociatedWithPodState {
    data: StampCardModel[];
    pagination: {
        currentPageIdx: number;
        totalN: number;
    };
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const sliceStampCardsAssociatedWithPod = createSlice({
    name: 'stampCardsAssociatedWithPod',
    initialState: {
        data: [],
        pagination: {
            currentPageIdx: 0,
            totalN: 0,
        },
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(
            state: ISliceStampCardsAssociatedWithPodState,
            action: { payload: { data: StampCardModel[]; totalN: number } },
        ) {
            state.data = action.payload.data;
            state.pagination.totalN = action.payload.totalN;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setPaginationCurrentPageIdx(state: ISliceStampCardsAssociatedWithPodState, action: { payload: number }) {
            state.pagination.currentPageIdx = action.payload;
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
