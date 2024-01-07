import React from 'react';
import type { IStampCardProps } from 'src/javascripts/components/StampCard';
import StampCard from 'src/javascripts/components/StampCard';
import { Box, CircularProgress, Typography, Grid, Stack, Pagination } from '@mui/material';
import CreateStampModal from 'src/javascripts/components/CreateStampModal';

export interface IStampCardListProps {
    stampCards: IStampCardProps[];
    isShowCreateStampModal: boolean;
    isLoading: boolean;
    paginationTotalPages: number;
    handleChangePaginationPageNumber: any;
}

const StampCardList: React.FC<IStampCardListProps> = (props: IStampCardListProps) => {
    const { stampCards, isShowCreateStampModal, isLoading, paginationTotalPages, handleChangePaginationPageNumber } =
        props;

    return isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    ) : (
        <React.Fragment>
            {stampCards.length > 0 ? (
                <React.Fragment>
                    <Box sx={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                        <Stack spacing={2}>
                            <Pagination count={paginationTotalPages} onChange={handleChangePaginationPageNumber} />
                        </Stack>
                    </Box>
                    <Grid container direction="row">
                        {stampCards.map((stampCard, idx: number) => (
                            <Grid item key={stampCard.id} sx={{ marginBottom: '16px', marginRight: '16px' }}>
                                <StampCard
                                    key={`${idx}_${stampCard.id}`}
                                    id={stampCard.id}
                                    name={stampCard.name}
                                    description={stampCard.description}
                                    isCollected={stampCard.isCollected}
                                    imageLink={stampCard.imageLink}
                                    numberOfUsersCollect={stampCard.numberOfUsersCollect}
                                    isPublic={stampCard.isPublic}
                                    isCollect={stampCard.isCollect}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </React.Fragment>
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
                                        <CreateStampModal idPod={null} />
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
