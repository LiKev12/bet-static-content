import { createSlice } from '@reduxjs/toolkit';
import PodPageModel from 'src/javascripts/models/PodPageModel';

export interface ISlicePodPageState {
    data: PodPageModel;
}

const slicePagePod = createSlice({
    name: 'pagePod',
    initialState: {
        data: new PodPageModel(null, true),
    },
    reducers: {
        setSliceState(state: ISlicePodPageState, action: any) {
            state.data = new PodPageModel(action.payload);
        },
    },
});

export const slicePagePodActions = slicePagePod.actions;
export default slicePagePod;
