import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import SearchEntities from 'src/javascripts/components/SearchEntities';
import PodCardList from 'src/javascripts/components/PodCardList';
import StampCardList from 'src/javascripts/components/StampCardList';
import CreatePodModal from 'src/javascripts/components/CreatePodModal';
import CreateStampModalButton from 'src/javascripts/components/CreateStampModalButton';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import { THEME } from 'src/javascripts/Theme';
import { PAGE_SIZE_POD, PAGE_SIZE_STAMP } from 'src/javascripts/clients/ResourceClientConfig';
import PodCardModel from 'src/javascripts/models/PodCardModel';
import StampCardModel from 'src/javascripts/models/StampCardModel';

const DEFAULT_SEARCH_ENTITY = 'pod';
const SEARCH_ENTITY_CHOICES = ['pod', 'stamp'];

const PageDiscover: React.FC = () => {
    const [searchEntity, setSearchEntity] = useState(DEFAULT_SEARCH_ENTITY);
    const [searchText, setSearchText] = useState('');

    const [podCardState, setPodCardState] = useState({
        data: [],
        isLoading: true,
        responseError: null,
        filter: {
            isShowAdvancedFilterOptions: false,
            filterIsMember: true,
            filterIsNotMember: true,
            filterIsModerator: true,
            filterIsNotModerator: true,
        },
        pagination: {
            pageNumber: 0,
            pageSize: PAGE_SIZE_POD,
            totalNumberOfPages: 1,
        },
    });
    const [stampCardState, setStampCardState] = useState({
        data: [],
        isLoading: true,
        responseError: null,
        filter: {
            isShowAdvancedFilterOptions: false,
            filterIsCollect: true,
            filterIsNotCollect: true,
        },
        pagination: {
            pageNumber: 0,
            pageSize: PAGE_SIZE_STAMP,
            totalNumberOfPages: 1,
        },
    });

    const handleGetPodCardsDiscover = (requestBodyObject: Record<string, unknown>): void => {
        ResourceClient.postResource('api/app/GetPodCardsDiscover', requestBodyObject)
            .then((responseJson: any) => {
                setPodCardState((prevState) => {
                    return {
                        ...prevState,
                        data: responseJson.map((datapoint: any) => {
                            return new PodCardModel(datapoint);
                        }),
                        isLoading: false,
                        pagination: {
                            ...prevState.pagination,
                            totalNumberOfPages: responseJson.totalPages,
                        },
                    };
                });
            })
            .catch((responseError: any) => {
                setPodCardState((prevState) => {
                    return {
                        ...prevState,
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };
    const handleGetStampCardsDiscover = (requestBodyObject: Record<string, unknown>): void => {
        ResourceClient.postResource('api/app/GetStampCardsDiscover', requestBodyObject)
            .then((responseJson: any) => {
                setStampCardState((prevState) => {
                    return {
                        ...prevState,
                        data: responseJson.map((datapoint: any) => {
                            return new StampCardModel(datapoint);
                        }),
                        isLoading: false,
                        pagination: {
                            ...prevState.pagination,
                            totalNumberOfPages: responseJson.totalPages,
                        },
                    };
                });
            })
            .catch((responseError: any) => {
                setStampCardState((prevState) => {
                    return {
                        ...prevState,
                        isLoading: false,
                        responseError,
                    };
                });
            });
    };
    useEffect(() => {
        handleGetPodCardsDiscover(getRequestParamsPod());
        handleGetStampCardsDiscover(getRequestParamsStamp());
        // eslint-disable-next-line
    }, []);

    const getRequestParamsPod = (): any => {
        return {
            filterNameOrDescription: searchText,
            filterIsMember: podCardState.filter.filterIsMember,
            filterIsNotMember: podCardState.filter.filterIsNotMember,
            filterIsModerator: podCardState.filter.filterIsModerator,
            filterIsNotModerator: podCardState.filter.filterIsNotModerator,
        };
    };

    const getRequestParamsStamp = (): any => {
        return {
            filterNameOrDescription: searchText,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
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
                                handleGetPodCardsDiscover(getRequestParamsPod());
                            } else if (searchEntity === 'stamp') {
                                handleGetStampCardsDiscover(getRequestParamsStamp());
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
                            podCards={podCardState.data}
                            isShowCreatePodModal={true}
                            isLoading={podCardState.isLoading}
                            paginationTotalPages={podCardState.pagination.totalNumberOfPages}
                            handleChangePaginationPageNumber={(
                                event: React.ChangeEvent<unknown>,
                                newPageNumber: number,
                            ) => {
                                setPodCardState((prevState) => {
                                    return {
                                        ...prevState,
                                        pagination: {
                                            ...prevState.pagination,
                                            pageNumber: newPageNumber - 1,
                                        },
                                    };
                                });
                            }}
                        />
                    ) : null}
                    {searchEntity === 'stamp' ? (
                        <StampCardList
                            stampCards={stampCardState.data}
                            isShowCreateStampModal={true}
                            isLoading={stampCardState.isLoading}
                            paginationTotalPages={stampCardState.pagination.totalNumberOfPages}
                            handleChangePaginationPageNumber={(
                                event: React.ChangeEvent<unknown>,
                                newPageNumber: number,
                            ) => {
                                setStampCardState((prevState) => {
                                    return {
                                        ...prevState,
                                        pagination: {
                                            ...prevState.pagination,
                                            pageNumber: newPageNumber - 1,
                                        },
                                    };
                                });
                            }}
                        />
                    ) : null}
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageDiscover;
