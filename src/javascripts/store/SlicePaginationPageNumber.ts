import { createSlice } from '@reduxjs/toolkit';

export interface ISlicePaginationPageNumberState {
    data: number;
}

const slicePaginationPageNumber = createSlice({
    name: 'paginationPageNumber',
    initialState: {
        data: 0,
    },
    reducers: {
        setStateData(state: ISlicePaginationPageNumberState, action: { payload: number }) {
            state.data = action.payload;
        },
    },
});

export const slicePaginationPageNumberActions = slicePaginationPageNumber.actions;
export default slicePaginationPageNumber;
