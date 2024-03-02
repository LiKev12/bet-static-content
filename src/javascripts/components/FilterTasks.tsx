import { useState } from 'react';
import { Box, Button, Checkbox, FormGroup, FormControlLabel, Grid, TextField } from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';

export interface IFilterTasksProps {
    handleChangeText: any;
    handleUpdateFilterState: any;
    isComplete: boolean;
    isNotComplete: boolean;
    isStar: boolean;
    isNotStar: boolean;
    isPin: boolean;
    isNotPin: boolean;
    isUseFilterComplete: boolean;
    isUseFilterStar: boolean;
    isUseFilterPin: boolean;
}

const FilterTasks: React.FC<IFilterTasksProps> = (props: IFilterTasksProps) => {
    const {
        handleChangeText,
        handleUpdateFilterState,
        isComplete,
        isNotComplete,
        isStar,
        isNotStar,
        isPin,
        isNotPin,
        isUseFilterComplete,
        isUseFilterStar,
        isUseFilterPin,
    } = props;
    const [isShowAdvancedFilterOptions, setShowAdvancedFilterOptions] = useState(false);

    return (
        <Box>
            <Grid container direction="column">
                <Grid item>
                    <TextField
                        id="filter-entities"
                        label={`Filter Tasks`}
                        variant="standard"
                        onChange={handleChangeText}
                        inputProps={{ maxLength: 50 }}
                        helperText={`Filter Tasks by name or description`}
                        sx={{ width: '680px' }}
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
                            {isUseFilterComplete ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isComplete}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsComplete');
                                                        }}
                                                    />
                                                }
                                                label="Complete"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isNotComplete}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsNotComplete');
                                                        }}
                                                    />
                                                }
                                                label="Incomplete"
                                            />
                                        </FormGroup>
                                    </Box>
                                </Grid>
                            ) : null}
                            {isUseFilterStar ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isStar}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsStar');
                                                        }}
                                                    />
                                                }
                                                label="Starred"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isNotStar}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsNotStar');
                                                        }}
                                                    />
                                                }
                                                label="No Star"
                                            />
                                        </FormGroup>
                                    </Box>
                                </Grid>
                            ) : null}
                            {isUseFilterPin ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isPin}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsPin');
                                                        }}
                                                    />
                                                }
                                                label="Pinned"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isNotPin}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsNotPin');
                                                        }}
                                                    />
                                                }
                                                label="No Pin"
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

export default FilterTasks;
