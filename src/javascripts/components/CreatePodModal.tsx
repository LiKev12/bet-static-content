import React, { useState } from 'react';
import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    FormControlLabel,
    FormControl,
    FormLabel,
    FormGroup,
    RadioGroup,
    Radio,
    // FormGroup,
    // Checkbox,
    Grid,
    Tooltip,
} from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';
import { getInputText } from 'src/javascripts/utilities';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
    MIN_LEN_CHARS_POD_NAME,
    MAX_LEN_CHARS_POD_NAME,
    MAX_LEN_CHARS_POD_DESCRIPTION,
    POD_INPUT_NAME_HELPER_TEXT,
    POD_INPUT_DESCRIPTION_HELPER_TEXT,
} from 'src/javascripts/Constants';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import ResourceClient from 'src/javascripts/clients/ResourceClient';

export interface CreatePodModalState {
    data: {
        name: string;
        isPublic: boolean;
        isRequireApproveRequestToJoin: boolean;
        description: string;
    };
    isBlurredInputName: boolean;
    isBlurredInputDescription: boolean;
    isModalOpen: boolean;
    response: {
        isError: boolean;
        errorMessage: string | null;
        isLoading: boolean;
    };
}

const CreatePodModal: React.FC = () => {
    const [createPodModalState, setCreatePodModalState] = useState<CreatePodModalState>({
        data: {
            name: '',
            description: '',
            isPublic: true,
            isRequireApproveRequestToJoin: false,
        },
        isBlurredInputName: false,
        isBlurredInputDescription: false,
        isModalOpen: false,
        response: {
            isError: false,
            errorMessage: null,
            isLoading: false,
        },
    });

    const handleClickOpen = (): void => {
        setCreatePodModalState((prevState: any) => {
            return { ...prevState, isModalOpen: true };
        });
    };
    const handleClose = (): void => {
        setCreatePodModalState((prevState: any) => {
            return { ...prevState, isModalOpen: false };
        });
    };

    const isErrorPodName =
        createPodModalState.data.name.length < MIN_LEN_CHARS_POD_NAME ||
        createPodModalState.data.name.length > MAX_LEN_CHARS_POD_NAME;
    const isErrorPodDescription = createPodModalState.data.description.length > MAX_LEN_CHARS_POD_DESCRIPTION;
    const isErrorCreatePod = isErrorPodName || isErrorPodDescription;
    return (
        <React.Fragment>
            <Button variant="contained" sx={{ width: '100%', height: '100%' }} onClick={handleClickOpen}>
                Create new Pod
            </Button>
            <Dialog open={createPodModalState.isModalOpen} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Create a Pod</DialogTitle>
                <DialogContent>
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText sx={{ marginBottom: '12px' }}>{`Enter name of Pod:`}</DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip title={'required, can modify after creation'} placement="right">
                                <InfoOutlinedIcon
                                    sx={{
                                        paddingLeft: '4px',
                                    }}
                                    fontSize="small"
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <TextField
                        id="create-pod-enter-name"
                        label="name"
                        sx={{ width: '100%', marginBottom: '12px' }}
                        value={createPodModalState.data.name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setCreatePodModalState((prevState: any) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        name: event.target.value,
                                    },
                                };
                            });
                        }}
                        onBlur={() => {
                            setCreatePodModalState((prevState: any) => {
                                return {
                                    ...prevState,
                                    isBlurredInputName: true,
                                };
                            });
                        }}
                        error={isErrorPodName && createPodModalState.isBlurredInputName}
                        helperText={POD_INPUT_NAME_HELPER_TEXT(getInputText(createPodModalState.data.name).length)}
                    />
                    <Grid container direction="row">
                        <Grid item>
                            <DialogContentText
                                sx={{ marginBottom: '12px' }}
                            >{`Enter description of Pod:`}</DialogContentText>
                        </Grid>
                        <Grid item>
                            <Tooltip title={'required, can modify after creation'} placement="right">
                                <InfoOutlinedIcon
                                    sx={{
                                        paddingLeft: '4px',
                                    }}
                                    fontSize="small"
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <TextField
                        id="create-pod-enter-description"
                        label="description"
                        multiline
                        minRows={4}
                        maxRows={4}
                        sx={{ width: '100%', marginBottom: '12px' }}
                        value={createPodModalState.data.description}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setCreatePodModalState((prevState: any) => {
                                return {
                                    ...prevState,
                                    data: {
                                        ...prevState.data,
                                        description: event.target.value,
                                    },
                                };
                            });
                        }}
                        onBlur={() => {
                            setCreatePodModalState((prevState: any) => {
                                return {
                                    ...prevState,
                                    isBlurredInputDescription: true,
                                };
                            });
                        }}
                        error={isErrorPodDescription && createPodModalState.isBlurredInputDescription}
                        helperText={POD_INPUT_DESCRIPTION_HELPER_TEXT(
                            getInputText(createPodModalState.data.description).length,
                        )}
                    />
                    <FormControl>
                        <Grid container direction="row">
                            <Grid item>
                                <FormLabel id="public-or-private-pod-setting">Public or Private:</FormLabel>
                            </Grid>
                            <Grid item>
                                <Tooltip
                                    // TODO: invite to private pod workflow
                                    title={'public Pods can be discovered whereas private Pods are invite only'}
                                    placement="right"
                                >
                                    <InfoOutlinedIcon
                                        sx={{
                                            paddingLeft: '4px',
                                        }}
                                        fontSize="small"
                                    />
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <RadioGroup
                            aria-labelledby="public-or-private-pod-setting"
                            defaultValue="public"
                            name="radio-buttons-group"
                            value={createPodModalState.data.isPublic ? 'public' : 'private'}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setCreatePodModalState((prevState: any) => {
                                    return {
                                        ...prevState,
                                        data: {
                                            ...prevState.data,
                                            isPublic: (event.target as HTMLInputElement).value === 'public',
                                            isRequireApproveRequestToJoin:
                                                (event.target as HTMLInputElement).value === 'private',
                                        },
                                    };
                                });
                            }}
                        >
                            <FormControlLabel value="public" control={<Radio />} label="Public" />
                            <FormControlLabel value="private" control={<Radio />} label="Private" />
                        </RadioGroup>
                    </FormControl>
                    <FormGroup>
                        <FormLabel id="other-pod-setting">Other:</FormLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={!createPodModalState.data.isPublic}
                                    checked={createPodModalState.data.isRequireApproveRequestToJoin}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setCreatePodModalState((prevState: any) => {
                                            const prevStateIsRequireApproveRequestToJoin: boolean =
                                                prevState.data.isRequireApproveRequestToJoin;
                                            return {
                                                ...prevState,
                                                data: {
                                                    ...prevState.data,
                                                    isRequireApproveRequestToJoin:
                                                        !prevStateIsRequireApproveRequestToJoin,
                                                },
                                            };
                                        });
                                    }}
                                />
                            }
                            label="Require moderator approval to join"
                        />
                    </FormGroup>
                    {createPodModalState.response.isError ? (
                        <Alert severity="error">{createPodModalState.response.errorMessage}</Alert>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setCreatePodModalState((prevState: any) => {
                                return {
                                    ...prevState,
                                    response: {
                                        ...prevState.response,
                                        isLoading: true,
                                    },
                                };
                            });
                            ResourceClient.postResource(
                                'api/pod/create/pod',
                                { idUser: MOCK_MY_USER_ID },
                                {
                                    name: getInputText(createPodModalState.data.name),
                                    isPublic: createPodModalState.data.isPublic,
                                    isRequireApproveRequestToJoin:
                                        createPodModalState.data.isRequireApproveRequestToJoin,
                                    ...(createPodModalState.data.description.length > 0
                                        ? { description: getInputText(createPodModalState.data.description) }
                                        : {}),
                                },
                            )
                                .then(() => {
                                    setCreatePodModalState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            response: {
                                                isLoading: false,
                                                isError: false,
                                                errorMessage: null,
                                            },
                                        };
                                    });
                                })
                                .catch((errorMessage: any) => {
                                    setCreatePodModalState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            response: {
                                                isLoading: false,
                                                isError: true,
                                                errorMessage,
                                            },
                                        };
                                    });
                                });
                        }}
                        disabled={isErrorCreatePod}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

// https://www.npmjs.com/package/react-avatar-editor
export default CreatePodModal;
