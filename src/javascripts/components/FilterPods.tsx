import { useState } from 'react';
import { Button, Box, Checkbox, FormGroup, FormControlLabel, Grid, TextField } from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';

export interface IFilterPodsProps {
    handleChangeText: any;
    handleUpdateFilterState: any;
    isUseKeyPodPublic: boolean;
    isPodPublic: boolean;
    isPodNotPublic: boolean;
    isUseKeyPodMember: boolean;
    isPodMember: boolean;
    isPodNotMember: boolean;
    isUseKeyPodModerator: boolean;
    isPodModerator: boolean;
    isPodNotModerator: boolean;
}

const FilterPods: React.FC<IFilterPodsProps> = (props: IFilterPodsProps) => {
    const {
        handleChangeText,
        handleUpdateFilterState,
        isUseKeyPodPublic,
        isPodPublic,
        isPodNotPublic,
        isUseKeyPodMember,
        isPodMember,
        isPodNotMember,
        isUseKeyPodModerator,
        isPodModerator,
        isPodNotModerator,
    } = props;
    const [isShowAdvancedFilterOptions, setShowAdvancedFilterOptions] = useState(false);
    return (
        <Box>
            <Grid container direction="column">
                <Grid item>
                    <TextField
                        id="filter-entities"
                        label={`Filter Pods`}
                        variant="standard"
                        onChange={handleChangeText}
                        inputProps={{ maxLength: 50 }}
                        helperText={`Filter Pods by name`}
                        sx={{ width: '800px' }}
                    />
                </Grid>
                <Grid item>
                    {isShowAdvancedFilterOptions ? (
                        <Button
                            sx={{ padding: '0px', textTransform: 'none' }}
                            variant="text"
                            onClick={() => {
                                setShowAdvancedFilterOptions(false);
                            }}
                        >
                            hide advanced filter options
                        </Button>
                    ) : (
                        <Button
                            sx={{ padding: '0px', textTransform: 'none' }}
                            variant="text"
                            onClick={() => {
                                setShowAdvancedFilterOptions(true);
                            }}
                        >
                            Show advanced filter options
                        </Button>
                    )}
                </Grid>
                {isShowAdvancedFilterOptions ? (
                    <Grid item>
                        <Grid container direction="row">
                            {isUseKeyPodPublic ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isPodPublic}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsPublic');
                                                        }}
                                                    />
                                                }
                                                label="Public"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isPodNotPublic}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsNotPublic');
                                                        }}
                                                    />
                                                }
                                                label="Not public"
                                            />
                                        </FormGroup>
                                    </Box>
                                </Grid>
                            ) : null}
                            {isUseKeyPodMember ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isPodMember}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsMember');
                                                        }}
                                                    />
                                                }
                                                label="Member"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isPodNotMember}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsNotMember');
                                                        }}
                                                    />
                                                }
                                                label="Not member"
                                            />
                                        </FormGroup>
                                    </Box>
                                </Grid>
                            ) : null}
                            {isUseKeyPodModerator ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isPodModerator}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsModerator');
                                                        }}
                                                    />
                                                }
                                                label="Moderator"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isPodNotModerator}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsNotModerator');
                                                        }}
                                                    />
                                                }
                                                label="Not moderator"
                                            />
                                        </FormGroup>
                                    </Box>
                                </Grid>
                            ) : null}
                        </Grid>
                    </Grid>
                ) : null}
            </Grid>
        </Box>
    );
};

export default FilterPods;
