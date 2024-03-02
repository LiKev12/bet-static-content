import { createSlice } from '@reduxjs/toolkit';
import type PodCardModel from 'src/javascripts/models/PodCardModel';
import Constants from 'src/javascripts/Constants';

export interface ISlicePodCardsDiscoverPageState {
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

const slicePodCardsDiscoverPage = createSlice({
    name: 'podCardsDiscoverPage',
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
            state: ISlicePodCardsDiscoverPageState,
            action: { payload: { data: PodCardModel[]; totalN: number } },
        ) {
            state.data = action.payload.data;
            state.pagination.totalN = action.payload.totalN;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setPaginationCurrentPageIdx(state: ISlicePodCardsDiscoverPageState, action: { payload: number }) {
            state.pagination.currentPageIdx = action.payload;
        },
        setStateResponseLoading(state: ISlicePodCardsDiscoverPageState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISlicePodCardsDiscoverPageState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const slicePodCardsDiscoverPageActions = slicePodCardsDiscoverPage.actions;
export default slicePodCardsDiscoverPage;
