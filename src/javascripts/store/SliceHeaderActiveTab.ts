import { createSlice } from '@reduxjs/toolkit';

export interface IHeaderActiveTabState {
    data: number;
}

const sliceHeaderActiveTab = createSlice({
    name: 'headerActiveTab',
    initialState: {
        data: 0,
    },
    reducers: {
        setStateData(state: IHeaderActiveTabState, action: { payload: number }) {
            state.data = action.payload;
        },
    },
});

export const sliceHeaderActiveTabActions = sliceHeaderActiveTab.actions;
export default sliceHeaderActiveTab;
