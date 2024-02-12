import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { THEME } from 'src/javascripts/Theme';
import PersonIcon from '@mui/icons-material/Person';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PlaceholderImagePod from 'src/assets/PlaceholderImagePod.png';

export interface IPodCardProps {
    id: string;
    name: string;
    description: string | null;
    imageLink: string | null;
    isPublic: boolean;
    numberOfMembers: number;
    isMember: boolean;
    isModerator: boolean;
}

const PodCard: React.FC<IPodCardProps> = (props: IPodCardProps) => {
    const { id, name, description, imageLink, numberOfMembers, isPublic, isMember, isModerator } = props;
    const cardBorderColor: string = THEME.palette.primary.main;
    return (
        <Card
            sx={{
                border: `3px solid ${cardBorderColor}`,
                width: '300px',
                position: 'relative',
            }}
        >
            <Box sx={{ position: 'absolute', top: '8px', right: '8px' }}>
                <Grid container direction="column">
                    <Grid sx={{ marginBottom: '2px' }}>
                        {isPublic ? (
                            <Tooltip title={`This Pod is public.`} placement="right">
                                <PublicRoundedIcon color="disabled" />
                            </Tooltip>
                        ) : (
                            <Tooltip title={`This Pod is private.`} placement="right">
                                <LockRoundedIcon color="disabled" />
                            </Tooltip>
                        )}
                    </Grid>

                    {isMember ? (
                        <Grid sx={{ marginBottom: '2px' }}>
                            <Tooltip title={'You are a member.'} placement="right">
                                <PersonIcon color="disabled" />
                            </Tooltip>
                        </Grid>
                    ) : null}
                    {isModerator ? (
                        <Grid sx={{ marginBottom: '2px' }}>
                            <Tooltip title={'You are a moderator.'} placement="right">
                                <ManageAccountsIcon color="disabled" />
                            </Tooltip>
                        </Grid>
                    ) : null}
                </Grid>
            </Box>
            <CardContent>
                <Link to={`/pods/${id}`}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <CardMedia
                            sx={{
                                height: '200px',
                                width: '200px',
                                cursor: 'pointer',
                                border: '2px solid',
                                borderRadius: '50%',
                                borderColor: THEME.palette.grey.A400,
                            }}
                            image={imageLink ?? PlaceholderImagePod}
                            title="podCardCardMedia"
                        />
                    </Box>
                </Link>
                <Typography variant="h6" sx={{ height: '36px', overflowY: 'auto', marginBottom: '12px' }}>
                    {name}
                </Typography>
                <Typography
                    variant="body2"
                    fontFamily="monospace"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '12px',
                        height: '21px',
                    }}
                >
                    {description}
                </Typography>
                <Box>
                    <CardActions
                        sx={{
                            paddingLeft: '0px',
                            paddingRight: '0px',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            size="small"
                            component={Link}
                            to={`/pods/${id}`}
                            sx={{ width: '100%' }}
                        >
                            {numberOfMembers === 1 ? `${numberOfMembers} member` : `${numberOfMembers} members`}
                        </Button>
                    </CardActions>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PodCard;
