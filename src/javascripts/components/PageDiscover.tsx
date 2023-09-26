import { useState } from 'react';
import { Box, Grid, Divider } from '@mui/material';
import SearchEntities from 'src/javascripts/components/SearchEntities';
import PodCardList from 'src/javascripts/components/PodCardList';
// import TaskCardList from 'src/javascripts/components/TaskCardList';
import StampCardList from 'src/javascripts/components/StampCardList';
import { MOCK_PODS } from 'src/javascripts/mocks/MockPods';
import { MOCK_STAMPS } from 'src/javascripts/mocks/MockStamps';
import CreatePodModal from 'src/javascripts/components/CreatePodModal';

import { THEME } from 'src/javascripts/Theme';

export interface IPageDiscoverProps {
    id: string;
}

const DEFAULT_SEARCH_ENTITY = 'pods';

const SEARCH_ENTITY_CHOICES = ['pods', 'stamps', 'tasks'];

const PageDiscover: React.FC<IPageDiscoverProps> = (props: IPageDiscoverProps) => {
    const [searchEntity, setSearchEntity] = useState(DEFAULT_SEARCH_ENTITY);
    const [searchText, setSearchText] = useState('');
    const searchTokens = searchText.split('|');
    console.log({ searchTokens });

    return (
        <Box
            sx={{
                height: '1000px',
                background: THEME.palette.gradient,
            }}
        >
            <Grid container direction="column">
                <Grid item>
                    <SearchEntities
                        id="temp_id"
                        handleChangeEntity={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchEntity(event.target.value);
                        }}
                        handleChangeText={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchText(event.target.value);
                        }}
                        entityChoices={SEARCH_ENTITY_CHOICES}
                        chosenEntity={searchEntity}
                    />
                </Grid>
                <Grid
                    item
                    sx={{
                        justifyContent: 'center',
                        display: 'flex',
                        paddingLeft: '48px',
                        paddingRight: '48px',
                        paddingTop: '24px',
                        paddingBottom: '24px',
                    }}
                >
                    <Box sx={{ width: '800px' }}>
                        <CreatePodModal id="temp_id" />
                    </Box>
                </Grid>
                <Grid item sx={{ paddingLeft: '48px', paddingRight: '48px' }}>
                    <Divider />
                </Grid>
                <Grid item sx={{ paddingLeft: '48px', paddingRight: '48px', paddingTop: '24px' }}>
                    <Box>
                        {searchEntity === 'pods' ? <PodCardList podCards={MOCK_PODS} /> : null}
                        {searchEntity === 'stamps' ? <StampCardList stampCards={MOCK_STAMPS} /> : null}
                        {/* {searchEntity === 'tasks' ? <TaskCardList /> : null} */}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageDiscover;
