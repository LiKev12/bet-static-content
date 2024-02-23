import { createSlice } from '@reduxjs/toolkit';
import type PodPageModel from 'src/javascripts/models/PodPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISlicePodCardsAssociatedWithUserState {
    data: PodPageModel[];
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const slicePodCardsAssociatedWithUser = createSlice({
    name: 'podCardsAssociatedWithUser',
    initialState: {
        data: [],
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISlicePodCardsAssociatedWithUserState, action: { payload: PodPageModel[] }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISlicePodCardsAssociatedWithUserState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISlicePodCardsAssociatedWithUserState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const slicePodCardsAssociatedWithUserActions = slicePodCardsAssociatedWithUser.actions;
export default slicePodCardsAssociatedWithUser;
