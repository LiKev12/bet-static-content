import { createSlice } from '@reduxjs/toolkit';
import type PodPageModel from 'src/javascripts/models/PodPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISlicePodCardsDiscoverPageState {
    data: PodPageModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const slicePodCardsDiscoverPage = createSlice({
    name: 'podCardsDiscoverPage',
    initialState: {
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISlicePodCardsDiscoverPageState, action: { payload: PodPageModel[] }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
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
