import { useState } from 'react';
import { Box, Button, Checkbox, FormGroup, FormControlLabel, Grid, TextField } from '@mui/material';
// import { THEME } from 'src/javascripts/Theme';

export interface IFilterStampsProps {
    handleChangeText: any;
    handleUpdateFilterState: any;
    isUseKeyStampPublic: boolean;
    isStampPublic: boolean;
    isStampNotPublic: boolean;
    isUseKeyStampCollected: boolean;
    isStampCollected: boolean;
    isStampNotCollected: boolean;
}

const FilterStamps: React.FC<IFilterStampsProps> = (props: IFilterStampsProps) => {
    const {
        handleChangeText,
        handleUpdateFilterState,
        isUseKeyStampPublic,
        isStampPublic,
        isStampNotPublic,
        isUseKeyStampCollected,
        isStampCollected,
        isStampNotCollected,
    } = props;
    const [isShowAdvancedFilterOptions, setShowAdvancedFilterOptions] = useState(false);

    return (
        <Box>
            <Grid container direction="column">
                <Grid item>
                    <TextField
                        id="filter-entities"
                        label={`Filter Stamps`}
                        variant="standard"
                        onChange={handleChangeText}
                        inputProps={{ maxLength: 50 }}
                        helperText={`Filter Stamps by name or description`}
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
                            {isUseKeyStampPublic ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isStampPublic}
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
                                                        checked={isStampNotPublic}
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
                            {isUseKeyStampCollected ? (
                                <Grid item>
                                    <Box sx={{ width: '200px' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isStampCollected}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsCollect');
                                                        }}
                                                    />
                                                }
                                                label="Collected"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isStampNotCollected}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleUpdateFilterState(event, 'filterIsNotCollect');
                                                        }}
                                                    />
                                                }
                                                label="Not Collected"
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

export default FilterStamps;
