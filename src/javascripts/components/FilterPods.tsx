import { useState } from 'react';
import { Button, Box, Checkbox, FormGroup, FormControlLabel, Grid, TextField } from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';

export interface IFilterPodsProps {
    handleChangeText: any;
    handleUpdateFilterState: any;
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
                        helperText={`Filter Pods by name or description`}
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
                            show advanced filter options
                        </Button>
                    )}
                </Grid>
                {isShowAdvancedFilterOptions ? (
                    <Grid item>
                        <Grid container direction="row">
                            {isUseKeyPodMember ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isPodMember}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'isPodMember');
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
                                                            handleUpdateFilterState(event, 'isPodNotMember');
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
                                                            handleUpdateFilterState(event, 'isPodModerator');
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
                                                            handleUpdateFilterState(event, 'isPodNotModerator');
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
