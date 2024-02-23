import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import SearchEntities from 'src/javascripts/components/SearchEntities';
import PodCardList from 'src/javascripts/components/PodCardList';
import StampCardList from 'src/javascripts/components/StampCardList';
import CreatePodModal from 'src/javascripts/components/CreatePodModal';
import CreateStampModalButton from 'src/javascripts/components/CreateStampModalButton';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import { THEME } from 'src/javascripts/Theme';
import PodCardModel from 'src/javascripts/models/PodCardModel';
import StampCardModel from 'src/javascripts/models/StampCardModel';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
import ResponseModel from 'src/javascripts/models/ResponseModel';
import { sliceHeaderActiveTabActions } from 'src/javascripts/store/SliceHeaderActiveTab';
import Constants from 'src/javascripts/Constants';
import { slicePodCardsDiscoverPageActions } from 'src/javascripts/store/SlicePodCardsDiscoverPage';
import { sliceStampCardsDiscoverPageActions } from 'src/javascripts/store/SliceStampCardsDiscoverPage';
import { slicePaginationPageNumberActions } from 'src/javascripts/store/SlicePaginationPageNumber';

import type { IRootState } from 'src/javascripts/store';

const DEFAULT_SEARCH_ENTITY = 'pod';
const SEARCH_ENTITY_CHOICES = ['pod', 'stamp'];

const PageDiscover: React.FC = () => {
    const dispatch = useDispatch();
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    const slicePodCardsDiscoverPageState = useSelector((state: IRootState) => state.podCardsDiscoverPage);
    const slicePodCardsDiscoverPageStateData = slicePodCardsDiscoverPageState.data.map((d: any) => new PodCardModel(d));
    const slicePodCardsDiscoverPageStateResponse = new ResponseModel(slicePodCardsDiscoverPageState.response);
    const sliceStampCardsDiscoverPageState = useSelector((state: IRootState) => state.stampCardsDiscoverPage);
    const sliceStampCardsDiscoverPageStateData = sliceStampCardsDiscoverPageState.data.map(
        (d: any) => new StampCardModel(d),
    );
    const sliceStampCardsDiscoverPageStateResponse = new ResponseModel(sliceStampCardsDiscoverPageState.response);
    const [searchEntity, setSearchEntity] = useState(DEFAULT_SEARCH_ENTITY);
    const [searchText, setSearchText] = useState('');

    const [podCardState, setPodCardState] = useState({
        filter: {
            isShowAdvancedFilterOptions: false,
            filterIsMember: true,
            filterIsNotMember: true,
            filterIsModerator: true,
            filterIsNotModerator: true,
        },
    });
    const [stampCardState, setStampCardState] = useState({
        filter: {
            isShowAdvancedFilterOptions: false,
            filterIsCollect: true,
            filterIsNotCollect: true,
        },
    });

    const handleGetPodCardsDiscover = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            dispatch(slicePaginationPageNumberActions.setStateData(1));
            const response = await ResourceClient.postResource(
                'api/app/GetPodCardsDiscover',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(slicePodCardsDiscoverPageActions.setStateData(response.data));
        } catch (e: any) {
            dispatch(slicePodCardsDiscoverPageActions.setStateResponseError(e?.response?.data?.message));
        }
    };
    const handleGetStampCardsDiscover = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            dispatch(slicePaginationPageNumberActions.setStateData(1));
            const response = await ResourceClient.postResource(
                'api/app/GetStampCardsDiscover',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(sliceStampCardsDiscoverPageActions.setStateData(response.data));
        } catch (e: any) {
            dispatch(sliceStampCardsDiscoverPageActions.setStateResponseError(e?.response?.data?.message));
        }
    };
    useEffect(() => {
        void dispatch(sliceHeaderActiveTabActions.setStateData(Constants.HEADER_ACTIVE_TAB_IDX__PAGE_DISCOVER));
        void handleGetPodCardsDiscover(getRequestParamsPod());
        void handleGetStampCardsDiscover(getRequestParamsStamp());
        // eslint-disable-next-line
    }, [searchEntity]);

    const getRequestParamsPod = (): any => {
        return {
            filterNameOrDescription: searchText,
            filterIsMember: podCardState.filter.filterIsMember,
            filterIsNotMember: podCardState.filter.filterIsNotMember,
            filterIsModerator: podCardState.filter.filterIsModerator,
            filterIsNotModerator: podCardState.filter.filterIsNotModerator,
            filterIsPublic: true,
            filterIsNotPublic: true,
        };
    };

    const getRequestParamsStamp = (): any => {
        return {
            filterNameOrDescription: searchText,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
            filterIsPublic: true,
            filterIsNotPublic: true,
        };
    };

    return (
        <Box
            sx={{
                background: THEME.palette.other.gradient,
                minHeight: '100vh',
            }}
        >
            <Grid container direction="column">
                <Grid item sx={{ padding: '0px 96px 24px 96px' }}>
                    {searchEntity === 'pod' ? <CreatePodModal /> : <CreateStampModalButton idPod={null} />}
                </Grid>
                <Grid item>
                    <SearchEntities
                        handleChangeEntity={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchEntity(event.target.value);
                        }}
                        handleChangeText={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchText(event.target.value);
                        }}
                        handleSearch={() => {
                            if (searchEntity === 'pod') {
                                void handleGetPodCardsDiscover(getRequestParamsPod());
                            } else if (searchEntity === 'stamp') {
                                void handleGetStampCardsDiscover(getRequestParamsStamp());
                            }
                        }}
                        entityChoices={SEARCH_ENTITY_CHOICES}
                        chosenEntity={searchEntity}
                    />
                </Grid>
                <Grid item sx={{ padding: '24px 96px 96px 96px' }}>
                    {searchEntity === 'pod' ? (
                        <Grid container direction="column">
                            <Grid item>
                                {podCardState.filter.isShowAdvancedFilterOptions ? (
                                    <Button
                                        sx={{ padding: '0px', textTransform: 'none' }}
                                        variant="text"
                                        onClick={() => {
                                            setPodCardState((prevState) => {
                                                return {
                                                    ...prevState,
                                                    filter: {
                                                        ...prevState.filter,
                                                        isShowAdvancedFilterOptions: false,
                                                    },
                                                };
                                            });
                                        }}
                                    >
                                        hide advanced search options
                                    </Button>
                                ) : (
                                    <Button
                                        sx={{ padding: '0px', textTransform: 'none' }}
                                        variant="text"
                                        onClick={() => {
                                            setPodCardState((prevState) => {
                                                return {
                                                    ...prevState,
                                                    filter: {
                                                        ...prevState.filter,
                                                        isShowAdvancedFilterOptions: true,
                                                    },
                                                };
                                            });
                                        }}
                                    >
                                        show advanced search options
                                    </Button>
                                )}
                            </Grid>
                            {podCardState.filter.isShowAdvancedFilterOptions ? (
                                <Grid item>
                                    <Grid container direction="row">
                                        <Grid item>
                                            <Box sx={{ width: '200px' }}>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={podCardState.filter.filterIsMember}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setPodCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsMember: event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Member"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={podCardState.filter.filterIsNotMember}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setPodCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsNotMember: event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Not member"
                                                    />
                                                </FormGroup>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Box sx={{ width: '200px' }}>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={podCardState.filter.filterIsModerator}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setPodCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsModerator: event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Moderator"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={podCardState.filter.filterIsNotModerator}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setPodCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsNotModerator:
                                                                                    event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Not moderator"
                                                    />
                                                </FormGroup>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : null}
                        </Grid>
                    ) : null}
                    {searchEntity === 'stamp' ? (
                        <Grid container direction="column">
                            <Grid item>
                                {stampCardState.filter.isShowAdvancedFilterOptions ? (
                                    <Button
                                        sx={{ padding: '0px', textTransform: 'none' }}
                                        variant="text"
                                        onClick={() => {
                                            setStampCardState((prevState) => {
                                                return {
                                                    ...prevState,
                                                    filter: {
                                                        ...prevState.filter,
                                                        isShowAdvancedFilterOptions: false,
                                                    },
                                                };
                                            });
                                        }}
                                    >
                                        hide advanced search options
                                    </Button>
                                ) : (
                                    <Button
                                        sx={{ padding: '0px', textTransform: 'none' }}
                                        variant="text"
                                        onClick={() => {
                                            setStampCardState((prevState) => {
                                                return {
                                                    ...prevState,
                                                    filter: {
                                                        ...prevState.filter,
                                                        isShowAdvancedFilterOptions: true,
                                                    },
                                                };
                                            });
                                        }}
                                    >
                                        show advanced search options
                                    </Button>
                                )}
                            </Grid>
                            {stampCardState.filter.isShowAdvancedFilterOptions ? (
                                <Grid item>
                                    <Grid container direction="row">
                                        <Grid item>
                                            <Box sx={{ width: '200px' }}>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={stampCardState.filter.filterIsCollect}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setStampCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsCollect: event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Collected"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={stampCardState.filter.filterIsNotCollect}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setStampCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsNotCollect:
                                                                                    event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Not collected"
                                                    />
                                                </FormGroup>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : null}
                        </Grid>
                    ) : null}
                    {searchEntity === 'pod' ? (
                        <PodCardList
                            podCards={slicePodCardsDiscoverPageStateData}
                            isShowCreatePodModal={true}
                            isLoading={slicePodCardsDiscoverPageStateResponse.getIsLoading()}
                            pageSize={Constants.PAGE_SIZE_DISCOVER_PAGE_POD_CARDS}
                        />
                    ) : null}
                    {searchEntity === 'stamp' ? (
                        <StampCardList
                            stampCards={sliceStampCardsDiscoverPageStateData}
                            isShowCreateStampModal={true}
                            isLoading={sliceStampCardsDiscoverPageStateResponse.getIsLoading()}
                            pageSize={Constants.PAGE_SIZE_DISCOVER_PAGE_STAMP_CARDS}
                        />
                    ) : null}
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageDiscover;
