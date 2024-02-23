import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StampCard from 'src/javascripts/components/StampCard';
import { Box, CircularProgress, Typography, Grid, Stack, Pagination } from '@mui/material';
import CreateStampModalButton from 'src/javascripts/components/CreateStampModalButton';
import { slicePaginationPageNumberActions } from 'src/javascripts/store/SlicePaginationPageNumber';
import { getIdxStart, getIdxEnd, getTotalNumberOfPages } from 'src/javascripts/utilities';

import type { IRootState } from 'src/javascripts/store';
import type StampCardModel from 'src/javascripts/models/StampCardModel';

export interface IStampCardListProps {
    stampCards: StampCardModel[];
    isShowCreateStampModal: boolean;
    isLoading: boolean;
    pageSize: number;
}

const StampCardList: React.FC<IStampCardListProps> = (props: IStampCardListProps) => {
    const dispatch = useDispatch();
    const slicePaginationPageNumberState = useSelector((state: IRootState) => state.paginationPageNumber);
    const slicePaginationPageNumberStateData = slicePaginationPageNumberState.data;
    const { stampCards, pageSize, isShowCreateStampModal, isLoading } = props;
    console.log('[RENDERED]');

    return isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    ) : (
        <React.Fragment>
            {stampCards.slice(
                getIdxStart(pageSize, slicePaginationPageNumberStateData),
                getIdxEnd(pageSize, slicePaginationPageNumberStateData),
            ).length > 0 ? (
                <Grid container direction="column">
                    <Grid item>
                        <Box sx={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                            <Stack spacing={2}>
                                <Pagination
                                    count={getTotalNumberOfPages(stampCards.length, pageSize)}
                                    onChange={(event: any, value: number) => {
                                        dispatch(slicePaginationPageNumberActions.setStateData(value));
                                    }}
                                    page={slicePaginationPageNumberStateData}
                                />
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid container direction="row">
                        {stampCards
                            .slice(
                                getIdxStart(pageSize, slicePaginationPageNumberStateData),
                                getIdxEnd(pageSize, slicePaginationPageNumberStateData),
                            )
                            .map((stampCard, idx: number) => (
                                <Grid item key={stampCard.getId()} sx={{ marginBottom: '16px', marginRight: '16px' }}>
                                    <StampCard
                                        key={`${idx}_${stampCard.getId()}`}
                                        id={stampCard.getId()}
                                        name={stampCard.getName()}
                                        description={stampCard.getDescription()}
                                        imageLink={stampCard.getImageLink()}
                                        numberOfUsersCollect={stampCard.getNumberOfUsersCollect()}
                                        isPublic={stampCard.getIsPublic()}
                                        isCollect={stampCard.getIsCollect()}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </Grid>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box>
                        <Grid container direction="column" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid item sx={{ marginTop: '24px', marginBottom: '24px' }}>
                                <Typography variant="h5">No Stamps found</Typography>
                            </Grid>
                            {isShowCreateStampModal ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <CreateStampModalButton idPod={null} />
                                    </Box>
                                </Grid>
                            ) : null}
                        </Grid>
                    </Box>
                </Box>
            )}
        </React.Fragment>
    );
};

export default StampCardList;
