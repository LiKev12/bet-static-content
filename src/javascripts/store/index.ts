import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sliceAuthentication from 'src/javascripts/store/SliceAuthentication';
import slicePagePod from 'src/javascripts/store/SlicePagePod';
import slicePageStamp from 'src/javascripts/store/SlicePageStamp';
import slicePageUser from 'src/javascripts/store/SlicePageUser';

const store = configureStore({
    reducer: combineReducers({
        authentication: sliceAuthentication.reducer,
        pagePod: slicePagePod.reducer,
        pageStamp: slicePageStamp.reducer,
        pageUser: slicePageUser.reducer,
    }),
});

export default store;
