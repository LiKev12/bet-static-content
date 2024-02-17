import { createSlice } from '@reduxjs/toolkit';

export interface ISlicePageStampState {
    toggleValue: boolean;
}
const slicePageStamp = createSlice({
    name: 'pageStamp',
    initialState: {
        toggleValue: false,
    },
    reducers: {
        toggle(state: ISlicePageStampState) {
            state.toggleValue = !state.toggleValue;
        },
    },
});

export const slicePageStampActions = slicePageStamp.actions;
export default slicePageStamp;
