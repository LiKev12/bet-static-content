import { createSlice } from '@reduxjs/toolkit';
import type AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import Constants from 'src/javascripts/Constants';

export interface ISliceAuthenticationState {
    // data: AuthenticationModel | null;
    data: any;
    response: {
        state: string;
        errorMessage: string | null;
    };
}
const sliceAuthentication = createSlice({
    name: 'authentication',
    initialState: {
        data: {
            jwtToken: sessionStorage.getItem('jwtToken'),
            idUser: sessionStorage.getItem('idUser'),
        },
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
        },
    },
    reducers: {
        setStateData(state: ISliceAuthenticationState, action: { payload: AuthenticationModel }) {
            sessionStorage.setItem('jwtToken', action.payload.jwtToken);
            sessionStorage.setItem('idUser', action.payload.idUser);
            state.data = action.payload;
            state.response = {
                state: Constants.RESPONSE_STATE_SUCCESS,
                errorMessage: null,
            };
        },
        clearStateData(state: ISliceAuthenticationState) {
            sessionStorage.removeItem('jwtToken');
            sessionStorage.removeItem('idUser');
            state.data = {
                jwtToken: '',
                idUser: '',
            };
            state.response = {
                state: Constants.RESPONSE_STATE_UNSTARTED,
                errorMessage: null,
            };
        },
        setStateResponseLoading(state: ISliceAuthenticationState) {
            state.response = {
                state: Constants.RESPONSE_STATE_LOADING,
                errorMessage: null,
            };
        },
        setStateResponseError(state: ISliceAuthenticationState, action: { payload: string | null }) {
            state.response = {
                state: Constants.RESPONSE_STATE_ERROR,
                errorMessage: action.payload,
            };
        },
    },
});

export const sliceAuthenticationActions = sliceAuthentication.actions;
export default sliceAuthentication;
