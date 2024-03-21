import { createSlice } from '@reduxjs/toolkit';
import type PersonalPageModel from 'src/javascripts/models/PersonalPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISlicePersonalPageState {
    data: PersonalPageModel | null;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const slicePagePersonal = createSlice({
    name: 'pagePersonal',
    initialState: {
        data: null,
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISlicePersonalPageState, action: { payload: PersonalPageModel }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISlicePersonalPageState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISlicePersonalPageState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const slicePagePersonalActions = slicePagePersonal.actions;
export default slicePagePersonal;
