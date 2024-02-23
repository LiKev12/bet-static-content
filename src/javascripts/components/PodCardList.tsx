import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PodCard from 'src/javascripts/components/PodCard';
import { CircularProgress, Typography, Box, Grid, Pagination, Stack } from '@mui/material';
import CreatePodModal from 'src/javascripts/components/CreatePodModal';
import { slicePaginationPageNumberActions } from 'src/javascripts/store/SlicePaginationPageNumber';
import { getIdxStart, getIdxEnd, getTotalNumberOfPages } from 'src/javascripts/utilities';

import type PodCardModel from 'src/javascripts/models/PodCardModel';
import type { IRootState } from 'src/javascripts/store';

export interface IPodCardListProps {
    podCards: PodCardModel[];
    isShowCreatePodModal: boolean;
    isLoading: boolean;
    pageSize: number;
}

const PodCardList: React.FC<IPodCardListProps> = (props: IPodCardListProps) => {
    const dispatch = useDispatch();
    const slicePaginationPageNumberState = useSelector((state: IRootState) => state.paginationPageNumber);
    const slicePaginationPageNumberStateData = slicePaginationPageNumberState.data;
    const { podCards, pageSize, isShowCreatePodModal, isLoading } = props;

    return isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    ) : (
        <React.Fragment>
            {podCards.slice(
                getIdxStart(pageSize, slicePaginationPageNumberStateData),
                getIdxEnd(pageSize, slicePaginationPageNumberStateData),
            ).length > 0 ? (
                <Grid container direction="column">
                    <Grid item>
                        <Box sx={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                            <Stack spacing={2}>
                                <Pagination
                                    count={getTotalNumberOfPages(podCards.length, pageSize)}
                                    onChange={(event: any, value: number) => {
                                        console.log('[VALUE]', value);
                                        dispatch(slicePaginationPageNumberActions.setStateData(value));
                                    }}
                                    page={slicePaginationPageNumberStateData}
                                />
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row">
                            {podCards
                                .slice(
                                    getIdxStart(pageSize, slicePaginationPageNumberStateData),
                                    getIdxEnd(pageSize, slicePaginationPageNumberStateData),
                                )
                                .map((podCard, idx: number) => (
                                    <Grid item key={podCard.getId()} sx={{ marginBottom: '16px', marginRight: '16px' }}>
                                        <PodCard
                                            key={`${idx}_${podCard.getId()}`}
                                            id={podCard.getId()}
                                            name={podCard.getName()}
                                            description={podCard.getDescription()}
                                            imageLink={podCard.getImageLink()}
                                            numberOfMembers={podCard.getNumberOfMembers()}
                                            isPublic={podCard.getIsPublic()}
                                            isMember={podCard.getIsMember()}
                                            isModerator={podCard.getIsModerator()}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>
                </Grid>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box>
                        <Grid container direction="column" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid item sx={{ marginTop: '24px', marginBottom: '24px' }}>
                                <Typography variant="h5">No Pods found</Typography>
                            </Grid>
                            {isShowCreatePodModal ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <CreatePodModal />
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

export default PodCardList;
