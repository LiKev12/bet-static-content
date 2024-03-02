import React from 'react';
import PodCard from 'src/javascripts/components/PodCard';
import { CircularProgress, Typography, Box, Grid, Pagination, Stack } from '@mui/material';
import CreatePodModal from 'src/javascripts/components/CreatePodModal';
import { getTotalNumberOfPages } from 'src/javascripts/utilities';

import type PodCardModel from 'src/javascripts/models/PodCardModel';

export interface IPodCardListProps {
    podCards: PodCardModel[];
    isShowCreatePodModal: boolean;
    isLoading: boolean;
    paginationTotalN: number;
    paginationPageSize: number;
    paginationPageIdx: number;
    paginationBatchN: number;
    handleUpdatePaginationPageIdx: any;
}

const PodCardList: React.FC<IPodCardListProps> = (props: IPodCardListProps) => {
    const {
        podCards,
        isShowCreatePodModal,
        isLoading,
        paginationTotalN,
        paginationBatchN,
        paginationPageSize,
        paginationPageIdx,
        handleUpdatePaginationPageIdx,
    } = props;

    const idxStart = (paginationPageIdx % paginationBatchN) * paginationPageSize;
    const idxEnd = idxStart + paginationPageSize;
    // console.log({ podCards, paginationPageIdx, idxStart, idxEnd });

    return isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    ) : (
        <React.Fragment>
            {podCards.length > 0 ? (
                <Grid container direction="column">
                    <Grid item>
                        <Box sx={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                            <Stack spacing={2}>
                                <Pagination
                                    count={getTotalNumberOfPages(paginationTotalN, paginationPageSize)}
                                    onChange={(event: any, value: number) => {
                                        handleUpdatePaginationPageIdx(value - 1);
                                    }}
                                    page={Math.min(
                                        paginationPageIdx + 1,
                                        getTotalNumberOfPages(paginationTotalN, paginationPageSize),
                                    )}
                                />
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row">
                            {podCards.slice(idxStart, idxEnd).map((podCard, idx: number) => (
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
