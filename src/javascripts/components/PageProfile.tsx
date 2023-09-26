import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Tab, Tabs } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import AvatarImageEditor from 'src/javascripts/components/AvatarImageEditor';
import { MOCK_USERS } from 'src/javascripts/mocks/MockUsers';
import { MOCK_PODS } from 'src/javascripts/mocks/MockPods';
import PodCardList from 'src/javascripts/components/PodCardList';

export interface IPageProfileProps {
    id: string;
}

const PageProfile: React.FC<IPageProfileProps> = (props: IPageProfileProps) => {
    const [entityTabOnDisplayIdx, setEntityTabOnDisplayIdx] = useState(0);
    const params = useParams();
    const [
        userData,
        // setUserData
    ] = useState(MOCK_USERS.filter((user: any) => user.id === params.id)[0]);
    return (
        <Box sx={{ background: THEME.palette.gradient }}>
            <Box
                sx={{
                    backgroundColor: THEME.palette.background.default,
                }}
            >
                <Grid container direction="row">
                    <Grid item sx={{ padding: '24px' }}>
                        <AvatarImageEditor id="temp_id" />
                    </Grid>
                    <Grid item sx={{ width: '800px', padding: '24px' }}>
                        <Grid container direction="column">
                            <Grid item sx={{ paddingBottom: '12px' }}>
                                <Typography variant="h3">{userData.name}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">{userData.bio}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ marginBottom: '24px' }}>
                <Tabs
                    value={entityTabOnDisplayIdx}
                    onChange={(e, activeTabIdx: number) => {
                        setEntityTabOnDisplayIdx(activeTabIdx);
                    }}
                    indicatorColor="primary"
                    centered
                >
                    <Tab sx={{ width: '150px' }} label="My Pods" />
                    <Tab sx={{ width: '150px' }} label="My Stamps" />
                    <Tab sx={{ width: '150px' }} label="My Tasks" />
                </Tabs>
            </Box>
            <Box sx={{ paddingLeft: '48px', paddingRight: '48px' }}>
                <PodCardList podCards={MOCK_PODS} />
            </Box>
        </Box>
    );
};

export default PageProfile;
