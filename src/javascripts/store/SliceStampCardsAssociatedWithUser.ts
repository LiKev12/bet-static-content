import { createSlice } from '@reduxjs/toolkit';
import type StampCardModel from 'src/javascripts/models/StampCardModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceStampCardsAssociatedWithUserState {
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

const sliceStampCardsAssociatedWithUser = createSlice({
    name: 'stampCardsAssociatedWithUser',
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
            state: ISliceStampCardsAssociatedWithUserState,
            action: { payload: { data: StampCardModel[]; totalN: number } },
        ) {
            state.data = action.payload.data;
            state.pagination.totalN = action.payload.totalN;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setPaginationCurrentPageIdx(state: ISliceStampCardsAssociatedWithUserState, action: { payload: number }) {
            state.pagination.currentPageIdx = action.payload;
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
