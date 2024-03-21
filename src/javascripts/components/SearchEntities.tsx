import { Box, Grid, IconButton, InputAdornment, Select, TextField, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface ISearchEntitiesProps {
    handleChangeEntity: any;
    handleChangeText: any;
    handleSearch: any;
    entityChoices: string[];
    chosenEntity: string;
}

const SearchEntities: React.FC<ISearchEntitiesProps> = (props: ISearchEntitiesProps) => {
    return (
        <Grid container direction="row" sx={{ justifyContent: 'center' }}>
            <Box sx={{ paddingLeft: '96px', paddingRight: '96px', display: 'flex', width: '100%' }}>
                <Grid item sx={{ width: '100%' }}>
                    <TextField
                        id="search-entities"
                        label={`Search ${props.chosenEntity}`}
                        placeholder={`Search ${props.chosenEntity} by name`}
                        multiline
                        minRows={4}
                        maxRows={4}
                        sx={{ width: '100%', backgroundColor: 'white' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={props.handleSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={props.handleChangeText}
                    />
                </Grid>
                <Grid item>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={props.chosenEntity}
                        onChange={props.handleChangeEntity}
                        sx={{ height: '100%', width: '102px', cursor: 'pointer' }} // 'stamp' is the longest word, needs this to be 102px
                    >
                        {props.entityChoices.map((entity, idx) => (
                            <MenuItem key={`${idx}_${entity}`} value={entity}>
                                {entity}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            </Box>
        </Grid>
    );
};

export default SearchEntities;
