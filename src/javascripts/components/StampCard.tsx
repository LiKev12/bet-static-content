import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { THEME } from 'src/javascripts/Theme';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

export interface IStampCardProps {
    id: string;
    name: string;
    description: string;
    isCollected: boolean;
    imageLink?: string;
    numberOfUsersCollect: number;
    isPublic: boolean;
    isCollect: boolean;
}

const StampCard: React.FC<IStampCardProps> = (props: IStampCardProps) => {
    const { id, name, description, imageLink, numberOfUsersCollect, isPublic, isCollect } = props;
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
                            <Tooltip title={`This Stamp is public.`} placement="right">
                                <PublicRoundedIcon color="disabled" />
                            </Tooltip>
                        ) : (
                            <Tooltip title={`This Stamp is private.`} placement="right">
                                <LockRoundedIcon color="disabled" />
                            </Tooltip>
                        )}
                    </Grid>
                    {isCollect ? (
                        <Grid sx={{ marginBottom: '2px' }}>
                            <Tooltip title={'You have collected this Stamp.'} placement="right">
                                <CollectionsBookmarkRoundedIcon color="disabled" />
                            </Tooltip>
                        </Grid>
                    ) : null}
                </Grid>
            </Box>
            <CardContent>
                <Link to={`/stamps/${id}`}>
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
                            image={imageLink}
                            title="stampCardCardMedia"
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
                        to={`/stamps/${id}`}
                        sx={{ width: '100%' }}
                    >
                        {numberOfUsersCollect === 1
                            ? `${numberOfUsersCollect} user collected`
                            : `${numberOfUsersCollect} users collected`}
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    );
};

export default StampCard;
