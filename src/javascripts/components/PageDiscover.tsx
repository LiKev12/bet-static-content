import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import SearchEntities from 'src/javascripts/components/SearchEntities';
import PodCardList from 'src/javascripts/components/PodCardList';
import StampCardList from 'src/javascripts/components/StampCardList';
import CreatePodModal from 'src/javascripts/components/CreatePodModal';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import { THEME } from 'src/javascripts/Theme';
import { PAGE_SIZE_POD, PAGE_SIZE_STAMP } from 'src/javascripts/clients/ResourceClientConfig';
import PodCardModel from 'src/javascripts/models/PodCardModel';
import StampCardModel from 'src/javascripts/models/StampCardModel';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';

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

    const handleGetResourcePod = (pathApi: string, queryParamsObject: Record<string, unknown>): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                console.log({ responseJson });
                setPodCardState((prevState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
                            const podModel = new PodCardModel(datapoint);
                            return {
                                id: podModel.getId(),
                                name: podModel.getName(),
                                description: podModel.getDescription(),
                                imageLink: podModel.getImageLink(),
                                numberOfMembers: podModel.getNumberOfMembers(),
                                isPublic: podModel.getIsPublic(),
                                isMember: podModel.getIsMember(),
                                isModerator: podModel.getIsModerator(),
                            };
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
    const handleGetResourceStamp = (pathApi: string, queryParamsObject: Record<string, unknown>): void => {
        ResourceClient.getResource(pathApi, queryParamsObject)
            .then((responseJson: any) => {
                console.log({ responseJson });
                setStampCardState((prevState) => {
                    return {
                        ...prevState,
                        data: responseJson.content.map((datapoint: any) => {
                            const stampCardModel = new StampCardModel(datapoint);
                            return {
                                id: stampCardModel.getId(),
                                name: stampCardModel.getName(),
                                description: stampCardModel.getDescription(),
                                imageLink: stampCardModel.getImageLink(),
                                numberOfUsersCollect: stampCardModel.getNumberOfUsersCollect(),
                                isPublic: stampCardModel.getIsPublic(),
                                isCollect: stampCardModel.getIsCollect(),
                            };
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
        handleGetResourcePod('api/pod/read/discover/pods', getRequestParamsPod());
        handleGetResourceStamp('api/stamp/read/discover/stamps', getRequestParamsStamp());
        // eslint-disable-next-line
    }, []);

    const getRequestParamsPod = (): any => {
        return {
            idUser: MOCK_MY_USER_ID,
            filterNameOrDescription: searchText,
            filterIsMember: podCardState.filter.filterIsMember,
            filterIsNotMember: podCardState.filter.filterIsNotMember,
            filterIsModerator: podCardState.filter.filterIsModerator,
            filterIsNotModerator: podCardState.filter.filterIsNotModerator,
            page: podCardState.pagination.pageNumber,
            size: podCardState.pagination.pageSize,
        };
    };

    const getRequestParamsStamp = (): any => {
        return {
            idUser: MOCK_MY_USER_ID,
            filterNameOrDescription: searchText,
            filterIsCollect: stampCardState.filter.filterIsCollect,
            filterIsNotCollect: stampCardState.filter.filterIsNotCollect,
            page: podCardState.pagination.pageNumber,
            size: podCardState.pagination.pageSize,
        };
    };

    return (
        <Box
            sx={{
                background: THEME.palette.gradient,
                minHeight: '100vh',
            }}
        >
            <Grid container direction="column">
                <Grid item sx={{ padding: '0px 96px 24px 96px' }}>
                    <CreatePodModal />
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
                                handleGetResourcePod('api/pod/read/discover/pods', getRequestParamsPod());
                            } else if (searchEntity === 'stamp') {
                                handleGetResourceStamp('api/stamp/read/discover/stamps', getRequestParamsStamp());
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
