import { createSlice } from '@reduxjs/toolkit';
import type PodCardModel from 'src/javascripts/models/PodCardModel';
import Constants from 'src/javascripts/Constants';

export interface ISlicePodCardsAssociatedWithStampState {
    data: PodCardModel[];
    pagination: {
        currentPageIdx: number;
        totalN: number;
    };
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const slicePodCardsAssociatedWithStamp = createSlice({
    name: 'podCardsAssociatedWithStamp',
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
            state: ISlicePodCardsAssociatedWithStampState,
            action: { payload: { data: PodCardModel[]; totalN: number } },
        ) {
            state.data = action.payload.data;
            state.pagination.totalN = action.payload.totalN;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setPaginationCurrentPageIdx(state: ISlicePodCardsAssociatedWithStampState, action: { payload: number }) {
            state.pagination.currentPageIdx = action.payload;
        },
        setStateResponseLoading(state: ISlicePodCardsAssociatedWithStampState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISlicePodCardsAssociatedWithStampState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const slicePodCardsAssociatedWithStampActions = slicePodCardsAssociatedWithStamp.actions;
export default slicePodCardsAssociatedWithStamp;
