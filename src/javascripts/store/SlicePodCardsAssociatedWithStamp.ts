import { createSlice } from '@reduxjs/toolkit';
import type PodPageModel from 'src/javascripts/models/PodPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISlicePodCardsAssociatedWithStampState {
    data: PodPageModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const slicePodCardsAssociatedWithStamp = createSlice({
    name: 'podCardsAssociatedWithStamp',
    initialState: {
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISlicePodCardsAssociatedWithStampState, action: { payload: PodPageModel[] }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
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
