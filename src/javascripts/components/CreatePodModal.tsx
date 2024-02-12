import React, { useState } from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    FormControlLabel,
    FormControl,
    FormLabel,
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
import Constants from 'src/javascripts/Constants';
import { MOCK_MY_USER_ID } from 'src/javascripts/mocks/Mocks';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import { Link } from 'react-router-dom';
export interface ICreatePodModalState {
    data: {
        id: string | null;
        name: string;
        isPublic: boolean;
        description: string;
    };
    isBlurredInputName: boolean;
    isBlurredInputDescription: boolean;
    isModalOpen: boolean;
    response: {
        state: string;
        errorMessage: string | null;
    };
}

const CreatePodModal: React.FC = () => {
    const [createPodModalState, setCreatePodModalState] = useState<ICreatePodModalState>({
        data: {
            id: null,
            name: '',
            description: '',
            isPublic: true,
        },
        isBlurredInputName: false,
        isBlurredInputDescription: false,
        isModalOpen: false,
        response: {
            state: Constants.RESPONSE_STATE_UNSTARTED,
            errorMessage: null,
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
        getInputText(createPodModalState.data.name).length < Constants.POD_NAME_MIN_LENGTH_CHARACTERS ||
        getInputText(createPodModalState.data.name).length > Constants.POD_NAME_MAX_LENGTH_CHARACTERS;
    const isErrorPodDescription =
        getInputText(createPodModalState.data.description).length > Constants.POD_DESCRIPTION_MAX_LENGTH_CHARACTERS;
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
                        helperText={Constants.POD_INPUT_NAME_HELPER_TEXT(
                            getInputText(createPodModalState.data.name).length,
                        )}
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
                        helperText={Constants.POD_INPUT_DESCRIPTION_HELPER_TEXT(
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
                                        },
                                    };
                                });
                            }}
                        >
                            <FormControlLabel value="public" control={<Radio />} label="Public" />
                            <FormControlLabel value="private" control={<Radio />} label="Private" />
                        </RadioGroup>
                    </FormControl>
                    {createPodModalState.response.state === Constants.RESPONSE_STATE_ERROR ? (
                        <Alert severity="error">{createPodModalState.response.errorMessage}</Alert>
                    ) : null}
                    {createPodModalState.response.state === Constants.RESPONSE_STATE_SUCCESS ? (
                        <Alert severity="success">
                            {'Pod successfully created. Click '}
                            <Link to={`/pods/${String(createPodModalState.data.id)}`}>{'here'}</Link> {' to view.'}
                        </Alert>
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
                                        state: Constants.RESPONSE_STATE_LOADING,
                                        errorMessage: null,
                                    },
                                };
                            });
                            ResourceClient.postResource(
                                'api/pod/create/pod',
                                { idUser: MOCK_MY_USER_ID },
                                {
                                    name: getInputText(createPodModalState.data.name),
                                    isPublic: createPodModalState.data.isPublic,
                                    description:
                                        getInputText(createPodModalState.data.description).length === 0
                                            ? null
                                            : getInputText(createPodModalState.data.description),
                                },
                            )
                                .then((responseJson: any) => {
                                    setCreatePodModalState((prevState: any) => {
                                        return {
                                            ...prevState,
                                            data: {
                                                ...prevState.data,
                                                id: responseJson.id,
                                            },
                                            response: {
                                                ...prevState.response,
                                                state: Constants.RESPONSE_STATE_SUCCESS,
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
                                                ...prevState.response,
                                                state: Constants.RESPONSE_STATE_ERROR,
                                                errorMessage,
                                            },
                                        };
                                    });
                                });
                        }}
                        disabled={
                            isErrorCreatePod ||
                            createPodModalState.response.state !== Constants.RESPONSE_STATE_UNSTARTED
                        }
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
