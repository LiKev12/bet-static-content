import React from 'react';
import type { IPodCardProps } from 'src/javascripts/components/PodCard';
import PodCard from 'src/javascripts/components/PodCard';
import { CircularProgress, Typography, Box, Grid, Pagination, Stack } from '@mui/material';
import CreatePodModal from 'src/javascripts/components/CreatePodModal';

export interface IPodCardListProps {
    podCards: IPodCardProps[];
    isShowCreatePodModal: boolean;
    isLoading: boolean;
    paginationTotalPages: number;
    handleChangePaginationPageNumber: any;
}

const PodCardList: React.FC<IPodCardListProps> = (props: IPodCardListProps) => {
    const { podCards, isShowCreatePodModal, isLoading, paginationTotalPages, handleChangePaginationPageNumber } = props;
    return isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    ) : (
        <React.Fragment>
            {podCards.length > 0 ? (
                <React.Fragment>
                    <Box sx={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                        <Stack spacing={2}>
                            <Pagination count={paginationTotalPages} onChange={handleChangePaginationPageNumber} />
                        </Stack>
                    </Box>
                    <Grid container direction="row">
                        {podCards.map((podCard, idx: number) => (
                            <Grid item key={podCard.id} sx={{ marginBottom: '16px', marginRight: '16px' }}>
                                <PodCard
                                    key={`${idx}_${podCard.id}`}
                                    id={podCard.id}
                                    name={podCard.name}
                                    description={podCard.description}
                                    imageLink={podCard.imageLink}
                                    numberOfMembers={podCard.numberOfMembers}
                                    isPublic={podCard.isPublic}
                                    isMember={podCard.isMember}
                                    isModerator={podCard.isModerator}
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
