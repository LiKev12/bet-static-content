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
import { getPaginationIdxStart, getPaginationN } from 'src/javascripts/utilities';

import type { IRootState } from 'src/javascripts/store';

const DEFAULT_SEARCH_ENTITY = 'Pods';
const SEARCH_ENTITY_CHOICES = ['Pods', 'Stamps'];

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
            filterIsPublic: true,
            filterIsNotPublic: true,
            filterIsMember: true,
            filterIsNotMember: true,
            filterIsModerator: true,
            filterIsNotModerator: true,
        },
    });
    const [stampCardState, setStampCardState] = useState({
        filter: {
            isShowAdvancedFilterOptions: false,
            filterIsPublic: true,
            filterIsNotPublic: true,
            filterIsCollect: true,
            filterIsNotCollect: true,
        },
    });

    const handleGetPodCardsDiscover = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
            dispatch(slicePodCardsDiscoverPageActions.setStateResponseLoading());
            const response = await ResourceClient.postResource(
                'api/app/GetPodCardsDiscover',
                requestBodyObject,
                sliceAuthenticationStateData.getJwtToken(),
            );
            dispatch(
                slicePodCardsDiscoverPageActions.setStateData({
                    data: response.data.data,
                    totalN: response.data.totalN,
                }),
            );
        } catch (e: any) {
            dispatch(slicePodCardsDiscoverPageActions.setStateResponseError(e?.response?.data?.message));
        }
    };
    const handleGetStampCardsDiscover = async (requestBodyObject: Record<string, unknown>): Promise<any> => {
        try {
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
        void dispatch(slicePodCardsDiscoverPageActions.setPaginationCurrentPageIdx(0));
        void dispatch(sliceStampCardsDiscoverPageActions.setPaginationCurrentPageIdx(0));
        void handleGetPodCardsDiscover(REQUEST_PARAMS_POD_CARDS(0));
        void handleGetStampCardsDiscover(REQUEST_PARAMS_STAMP_CARDS(0));
        // eslint-disable-next-line
    }, [searchEntity]);

    const REQUEST_PARAMS_POD_CARDS = (currentPageIdx: number): any => {
        return {
            filterByName: searchText,
            filterIsMember: podCardState.filter.filterIsMember,
            filterIsNotMember: podCardState.filter.filterIsNotMember,
            filterIsModerator: podCardState.filter.filterIsModerator,
            filterIsNotModerator: podCardState.filter.filterIsNotModerator,
            filterIsPublic: podCardState.filter.filterIsPublic,
            filterIsNotPublic: podCardState.filter.filterIsNotPublic,
            paginationIdxStart: getPaginationIdxStart(
                currentPageIdx,
                Constants.PAGINATION_BATCH_N,
                Constants.PAGE_SIZE_POD_CARDS_DISCOVER_PAGE,
            ),
            paginationN: getPaginationN(Constants.PAGE_SIZE_POD_CARDS_DISCOVER_PAGE, Constants.PAGINATION_BATCH_N),
        };
    };

    const REQUEST_PARAMS_STAMP_CARDS = (currentPageIdx: number): any => {
        return {
            filterByName: searchText,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
            filterIsPublic: stampCardState.filter.filterIsPublic,
            filterIsNotPublic: stampCardState.filter.filterIsNotPublic,
            paginationIdxStart: getPaginationIdxStart(
                currentPageIdx,
                Constants.PAGINATION_BATCH_N,
                Constants.PAGE_SIZE_STAMP_CARDS_DISCOVER_PAGE,
            ),
            paginationN: getPaginationN(Constants.PAGE_SIZE_STAMP_CARDS_DISCOVER_PAGE, Constants.PAGINATION_BATCH_N),
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
                    {searchEntity === 'Pods' ? (
                        <CreatePodModal
                            sideEffect={() => {
                                void handleGetPodCardsDiscover(REQUEST_PARAMS_POD_CARDS(0));
                            }}
                        />
                    ) : (
                        <CreateStampModalButton
                            idPod={null}
                            sideEffect={() => {
                                void handleGetStampCardsDiscover(REQUEST_PARAMS_STAMP_CARDS(0));
                            }}
                        />
                    )}
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
                            void dispatch(slicePodCardsDiscoverPageActions.setPaginationCurrentPageIdx(0));
                            void dispatch(sliceStampCardsDiscoverPageActions.setPaginationCurrentPageIdx(0));
                            if (searchEntity === 'Pods') {
                                void handleGetPodCardsDiscover(REQUEST_PARAMS_POD_CARDS(0));
                            } else if (searchEntity === 'Stamps') {
                                void handleGetStampCardsDiscover(REQUEST_PARAMS_STAMP_CARDS(0));
                            }
                        }}
                        entityChoices={SEARCH_ENTITY_CHOICES}
                        chosenEntity={searchEntity}
                    />
                </Grid>
                <Grid item sx={{ padding: '24px 96px 96px 96px' }}>
                    {searchEntity === 'Pods' ? (
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
                                        Show advanced search options
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
                                                                checked={podCardState.filter.filterIsPublic}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setPodCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsPublic: event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Public"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={podCardState.filter.filterIsNotPublic}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setPodCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsNotPublic: event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Not public"
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
                    {searchEntity === 'Stamps' ? (
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
                                        Show advanced search options
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
                                                                checked={stampCardState.filter.filterIsPublic}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setStampCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsPublic: event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Public"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={stampCardState.filter.filterIsNotPublic}
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    setStampCardState((prevState) => {
                                                                        return {
                                                                            ...prevState,
                                                                            filter: {
                                                                                ...prevState.filter,
                                                                                filterIsNotPublic: event.target.checked,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                        }
                                                        label="Not public"
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
                    {searchEntity === 'Pods' ? (
                        <PodCardList
                            podCards={slicePodCardsDiscoverPageStateData}
                            isShowCreatePodModal={true}
                            isLoading={slicePodCardsDiscoverPageStateResponse.getIsLoading()}
                            paginationPageSize={Constants.PAGE_SIZE_POD_CARDS_DISCOVER_PAGE}
                            paginationBatchN={Constants.PAGINATION_BATCH_N}
                            paginationTotalN={slicePodCardsDiscoverPageState.pagination.totalN}
                            paginationPageIdx={slicePodCardsDiscoverPageState.pagination.currentPageIdx}
                            handleUpdatePaginationPageIdx={(newPaginationPageIdx: number) => {
                                const isRequireRequestNewBatch =
                                    Math.floor(newPaginationPageIdx / Constants.PAGINATION_BATCH_N) !==
                                    Math.floor(
                                        slicePodCardsDiscoverPageState.pagination.currentPageIdx /
                                            Constants.PAGINATION_BATCH_N,
                                    );
                                dispatch(
                                    slicePodCardsDiscoverPageActions.setPaginationCurrentPageIdx(newPaginationPageIdx),
                                );
                                if (isRequireRequestNewBatch) {
                                    void handleGetPodCardsDiscover(REQUEST_PARAMS_POD_CARDS(newPaginationPageIdx));
                                }
                            }}
                            sideEffect={() => {
                                void handleGetPodCardsDiscover(REQUEST_PARAMS_POD_CARDS(0));
                            }}
                        />
                    ) : null}
                    {searchEntity === 'Stamps' ? (
                        <StampCardList
                            stampCards={sliceStampCardsDiscoverPageStateData}
                            isShowCreateStampModal={true}
                            isLoading={sliceStampCardsDiscoverPageStateResponse.getIsLoading()}
                            paginationPageSize={Constants.PAGE_SIZE_STAMP_CARDS_DISCOVER_PAGE}
                            paginationBatchN={Constants.PAGINATION_BATCH_N}
                            paginationTotalN={sliceStampCardsDiscoverPageState.pagination.totalN}
                            paginationPageIdx={sliceStampCardsDiscoverPageState.pagination.currentPageIdx}
                            handleUpdatePaginationPageIdx={(newPaginationPageIdx: number) => {
                                const isRequireRequestNewBatch =
                                    Math.floor(newPaginationPageIdx / Constants.PAGINATION_BATCH_N) !==
                                    Math.floor(
                                        sliceStampCardsDiscoverPageState.pagination.currentPageIdx /
                                            Constants.PAGINATION_BATCH_N,
                                    );
                                dispatch(
                                    sliceStampCardsDiscoverPageActions.setPaginationCurrentPageIdx(
                                        newPaginationPageIdx,
                                    ),
                                );
                                if (isRequireRequestNewBatch) {
                                    void handleGetStampCardsDiscover(REQUEST_PARAMS_STAMP_CARDS(newPaginationPageIdx));
                                }
                            }}
                            sideEffect={() => {
                                void handleGetStampCardsDiscover(REQUEST_PARAMS_STAMP_CARDS(0));
                            }}
                        />
                    ) : null}
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageDiscover;
