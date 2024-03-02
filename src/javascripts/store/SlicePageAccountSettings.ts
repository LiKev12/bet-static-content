import { createSlice } from '@reduxjs/toolkit';
import type AccountSettingsPageModel from 'src/javascripts/models/AccountSettingsPageModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceAccountSettingsPageState {
    data: AccountSettingsPageModel | null;
    email: string;
    timeZone: string;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const slicePageAccountSettings = createSlice({
    name: 'pageAccountSettings',
    initialState: {
        data: null,
        email: '',
        timeZone: '',
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateDataInitial(state: ISliceAccountSettingsPageState, action: { payload: AccountSettingsPageModel }) {
            state.data = action.payload;
            state.email = action.payload.email;
            state.timeZone = action.payload.timeZone;
        },
        setStateData(state: ISliceAccountSettingsPageState, action: { payload: AccountSettingsPageModel }) {
            state.data = action.payload;
            state.email = action.payload.email;
            state.timeZone = action.payload.timeZone;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        setEmail(state: ISliceAccountSettingsPageState, action: { payload: string }) {
            state.email = action.payload;
        },
        setTimeZone(state: ISliceAccountSettingsPageState, action: { payload: string }) {
            state.timeZone = action.payload;
        },
        setStateResponseLoading(state: ISliceAccountSettingsPageState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceAccountSettingsPageState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
        setStateResponseUnstarted(state: ISliceAccountSettingsPageState) {
            state.response = {
                state: Constants.RESPONSE_STATE_UNSTARTED,
                errorMessage: null,
            };
        },
    },
});

export const slicePageAccountSettingsActions = slicePageAccountSettings.actions;
export default slicePageAccountSettings;
