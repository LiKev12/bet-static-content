import { createSlice } from '@reduxjs/toolkit';
import type StampPageModel from 'src/javascripts/models/StampPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceStampCardsAssociatedWithUserState {
    data: StampPageModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const sliceStampCardsAssociatedWithUser = createSlice({
    name: 'stampCardsAssociatedWithUser',
    initialState: {
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISliceStampCardsAssociatedWithUserState, action: { payload: StampPageModel[] }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISliceStampCardsAssociatedWithUserState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceStampCardsAssociatedWithUserState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const sliceStampCardsAssociatedWithUserActions = sliceStampCardsAssociatedWithUser.actions;
export default sliceStampCardsAssociatedWithUser;
