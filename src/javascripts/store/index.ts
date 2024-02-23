import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sliceAuthentication from 'src/javascripts/store/SliceAuthentication';
import slicePagePod from 'src/javascripts/store/SlicePagePod';
import slicePageStamp from 'src/javascripts/store/SlicePageStamp';
import slicePageUser from 'src/javascripts/store/SlicePageUser';
import sliceVisualization from 'src/javascripts/store/SliceVisualization';
import sliceHeaderActiveTab from 'src/javascripts/store/SliceHeaderActiveTab';
import slicePodCardsDiscoverPage from 'src/javascripts/store/SlicePodCardsDiscoverPage';
import sliceStampCardsDiscoverPage from 'src/javascripts/store/SliceStampCardsDiscoverPage';
import slicePaginationPageNumber from 'src/javascripts/store/SlicePaginationPageNumber';
import slicePodCardsAssociatedWithStamp from 'src/javascripts/store/SlicePodCardsAssociatedWithStamp';
import sliceStampCardsAssociatedWithPod from 'src/javascripts/store/SliceStampCardsAssociatedWithPod';
import slicePodCardsAssociatedWithUser from 'src/javascripts/store/SlicePodCardsAssociatedWithUser';
import sliceStampCardsAssociatedWithUser from 'src/javascripts/store/SliceStampCardsAssociatedWithUser';

const store = configureStore({
    reducer: combineReducers({
        authentication: sliceAuthentication.reducer,
        pagePod: slicePagePod.reducer,
        pageStamp: slicePageStamp.reducer,
        pageUser: slicePageUser.reducer,
        visualization: sliceVisualization.reducer,
        headerActiveTab: sliceHeaderActiveTab.reducer,
        podCardsDiscoverPage: slicePodCardsDiscoverPage.reducer,
        stampCardsDiscoverPage: sliceStampCardsDiscoverPage.reducer,
        paginationPageNumber: slicePaginationPageNumber.reducer,
        podCardsAssociatedWithStamp: slicePodCardsAssociatedWithStamp.reducer,
        stampCardsAssociatedWithPod: sliceStampCardsAssociatedWithPod.reducer,
        podCardsAssociatedWithUser: slicePodCardsAssociatedWithUser.reducer,
        stampCardsAssociatedWithUser: sliceStampCardsAssociatedWithUser.reducer,
    }),
});

export type IRootState = ReturnType<typeof store.getState>;
export default store;
