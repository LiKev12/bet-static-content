import { Box, Checkbox, FormGroup, FormControlLabel, Grid, TextField } from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';

export interface IFilterEntitiesProps {
    id: string;
    handleChangeText: any;
    handleToggleFilterComplete: any;
    handleToggleFilterIncomplete: any;
    isToggleFilterComplete: boolean;
    isToggleFilterIncomplete: boolean;
    entity: string;
}

const FilterEntities: React.FC<IFilterEntitiesProps> = (props: IFilterEntitiesProps) => {
    return (
        <Box>
            <Grid container direction="column">
                <Grid item>
                    <TextField
                        id="filter-entities"
                        label={`Filter ${props.entity}`}
                        variant="standard"
                        onChange={props.handleChangeText}
                        inputProps={{ maxLength: 50 }}
                        helperText={`Filter ${props.entity} by name or description`}
                        sx={{ width: '800px' }}
                    />
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
            </Grid>
        </Box>
    );
};

export default FilterEntities;
