import { createSlice } from '@reduxjs/toolkit';
import type StampPageModel from 'src/javascripts/models/StampPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceStampCardsDiscoverPageState {
    data: StampPageModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const sliceStampCardsDiscoverPage = createSlice({
    name: 'stampCardsDiscoverPage',
    initialState: {
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISliceStampCardsDiscoverPageState, action: { payload: StampPageModel[] }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISliceStampCardsDiscoverPageState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceStampCardsDiscoverPageState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const sliceStampCardsDiscoverPageActions = sliceStampCardsDiscoverPage.actions;
export default sliceStampCardsDiscoverPage;
