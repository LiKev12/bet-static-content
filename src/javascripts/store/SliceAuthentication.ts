import { createSlice } from '@reduxjs/toolkit';

export interface ISliceAuthenticationState {
    toggleValue: boolean;
}
const sliceAuthentication = createSlice({
    name: 'authentication',
    initialState: {
        toggleValue: false,
    },
    reducers: {
        toggle(state: ISliceAuthenticationState) {
            state.toggleValue = !state.toggleValue;
        },
    },
});

export const sliceAuthenticationActions = sliceAuthentication.actions;
export default sliceAuthentication;
