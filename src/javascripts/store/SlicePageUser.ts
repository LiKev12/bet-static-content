import { createSlice } from '@reduxjs/toolkit';

export interface ISlicePageUserState {
    toggleValue: boolean;
}
const slicePageUser = createSlice({
    name: 'pageUser',
    initialState: {
        toggleValue: false,
    },
    reducers: {
        toggle(state: ISlicePageUserState) {
            state.toggleValue = !state.toggleValue;
        },
    },
});

export const slicePageUserActions = slicePageUser.actions;
export default slicePageUser;
