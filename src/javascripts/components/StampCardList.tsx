import React from 'react';
import StampCard from 'src/javascripts/components/StampCard';
import { Box, CircularProgress, Typography, Grid, Stack, Pagination } from '@mui/material';
import CreateStampModalButton from 'src/javascripts/components/CreateStampModalButton';
import { getTotalNumberOfPages } from 'src/javascripts/utilities';

import type StampCardModel from 'src/javascripts/models/StampCardModel';

export interface IStampCardListProps {
    stampCards: StampCardModel[];
    isShowCreateStampModal: boolean;
    isLoading: boolean;
    paginationTotalN: number;
    paginationPageSize: number;
    paginationPageIdx: number;
    paginationBatchN: number;
    handleUpdatePaginationPageIdx: any;
}

const StampCardList: React.FC<IStampCardListProps> = (props: IStampCardListProps) => {
    const {
        stampCards,
        isShowCreateStampModal,
        isLoading,
        paginationTotalN,
        paginationBatchN,
        paginationPageSize,
        paginationPageIdx,
        handleUpdatePaginationPageIdx,
    } = props;

    return isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    ) : (
        <React.Fragment>
            {stampCards.length > 0 ? (
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
                    <Grid container direction="row">
                        {stampCards
                            .slice(
                                (paginationPageIdx % paginationBatchN) * paginationPageSize,
                                ((paginationPageIdx % paginationBatchN) + 1) * paginationPageSize,
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
