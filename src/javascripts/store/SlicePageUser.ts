import { createSlice } from '@reduxjs/toolkit';
import type UserPageModel from 'src/javascripts/models/UserPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceUserPageState {
    data: UserPageModel | null;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const slicePageUser = createSlice({
    name: 'pageUser',
    initialState: {
        data: null,
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISliceUserPageState, action: { payload: UserPageModel }) {
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISliceUserPageState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceUserPageState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const slicePageUserActions = slicePageUser.actions;
export default slicePageUser;
