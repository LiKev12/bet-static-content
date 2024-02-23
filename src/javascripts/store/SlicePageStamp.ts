import { createSlice } from '@reduxjs/toolkit';
import type StampPageModel from 'src/javascripts/models/StampPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceStampPageState {
    data: StampPageModel | null;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const slicePageStamp = createSlice({
    name: 'pageStamp',
    initialState: {
        data: null,
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISliceStampPageState, action: { payload: StampPageModel }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISliceStampPageState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceStampPageState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const slicePageStampActions = slicePageStamp.actions;
export default slicePageStamp;
