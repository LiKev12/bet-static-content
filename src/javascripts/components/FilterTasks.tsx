import { Box, Checkbox, FormGroup, FormControlLabel, Grid, TextField } from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';

export interface IFilterTasksProps {
    id: string;
    handleChangeText: any;
    handleToggleFilterComplete: any;
    handleToggleFilterIncomplete: any;
    handleToggleFilterIsStarred: any;
    handleToggleFilterIsNotStarred: any;
    handleToggleFilterIsPinned: any;
    handleToggleFilterIsNotPinned: any;
    isToggleFilterComplete: boolean;
    isToggleFilterIncomplete: boolean;
    isToggleFilterIsStarred: boolean;
    isToggleFilterIsNotStarred: boolean;
    isToggleFilterIsPinned: boolean;
    isToggleFilterIsNotPinned: boolean;
}

const FilterTasks: React.FC<IFilterTasksProps> = (props: IFilterTasksProps) => {
    return (
        <Box>
            <Grid container direction="column">
                <Grid item>
                    <TextField
                        id="filter-entities"
                        label={`Filter tasks`}
                        variant="standard"
                        onChange={props.handleChangeText}
                        inputProps={{ maxLength: 50 }}
                        helperText={`Filter tasks by name or description`}
                        sx={{ width: '800px' }}
                    />
                </Grid>
                <Grid item>
                    <Grid container direction="row">
                        <Grid item>
                            <Box sx={{ width: '200px' }}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={props.isToggleFilterComplete}
                                                onChange={props.handleToggleFilterComplete}
                                            />
                                        }
                                        label="Complete"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={props.isToggleFilterIncomplete}
                                                onChange={props.handleToggleFilterIncomplete}
                                            />
                                        }
                                        label="Incomplete"
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
                                                checked={props.isToggleFilterIsStarred}
                                                onChange={props.handleToggleFilterIsStarred}
                                            />
                                        }
                                        label="Starred"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={props.isToggleFilterIsNotStarred}
                                                onChange={props.handleToggleFilterIsNotStarred}
                                            />
                                        }
                                        label="No Star"
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
                                                checked={props.isToggleFilterIsPinned}
                                                onChange={props.handleToggleFilterIsPinned}
                                            />
                                        }
                                        label="Pinned"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={props.isToggleFilterIsNotPinned}
                                                onChange={props.handleToggleFilterIsNotPinned}
                                            />
                                        }
                                        label="No Pin"
                                    />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FilterTasks;
