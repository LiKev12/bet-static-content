import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, IconButton, Typography, Tooltip } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { THEME } from 'src/javascripts/Theme';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import UserBubbleListButton from 'src/javascripts/components/UserBubbleListButton';
import { MOCK_USERS } from 'src/javascripts/mocks/MockUsers';

export interface ITaskCardProps {
    id: string;
    name: string;
    description: string;
    numPoints: number;
    imagePath: string;
    isComplete: boolean;
    isStarred: boolean;
    isPinned: boolean;
    dateCreated: string;
    dateUpdated: string;
    dateTargeted: string;
    dateCompleted: string;
    handleToggleTaskComplete: any;
}

const getDateDescription = (
    dateCreated: string,
    dateUpdated: string,
    dateTargeted: string,
    dateCompleted: string,
): string => {
    let dateDescription = `Created ${dateCreated}`;
    if (dateUpdated !== null) {
        dateDescription += ` · Updated ${dateUpdated}`;
    }
    if (dateTargeted !== null) {
        dateDescription += ` · Target ${dateTargeted}`;
    }
    if (dateCompleted !== null) {
        dateDescription += ` · Completed ${dateCompleted}`;
    }
    return dateDescription;
};

const TaskCard: React.FC<ITaskCardProps> = (props: ITaskCardProps) => {
    const [isEnabledShowMore, toggleShowMore] = useState(false);
    const [isTaskStarred, toggleTaskStarred] = useState(props.isStarred);
    const [isTaskPinned, toggleTaskPinned] = useState(props.isPinned);

    const handleToggleTaskStarred = (): void => {
        toggleTaskStarred((isTaskStarredPrev) => !isTaskStarredPrev);
    };
    const handleToggleTaskPinned = (): void => {
        toggleTaskPinned((isTaskPinnedPrev) => !isTaskPinnedPrev);
    };
    const {
        id,
        name,
        description,
        numPoints,
        handleToggleTaskComplete,
        isComplete,
        dateCreated,
        dateCompleted,
        dateUpdated,
        dateTargeted,
    } = props;

    const dateDescription = getDateDescription(dateCreated, dateUpdated, dateTargeted, dateCompleted);

    return (
        <Card
            sx={{
                fontFamily: 'Raleway',
                color: THEME.palette.grey.A700,
                marginBottom: '16px',
                width: '650px',
                position: 'relative',
            }}
        >
            <CardContent>
                <Grid container direction="row">
                    <Grid item sx={{ paddingRight: '8px', paddingTop: '8px' }}>
                        <IconButton onClick={handleToggleTaskComplete.bind(this, id)}>
                            {isComplete ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                        </IconButton>
                    </Grid>
                    <Grid item sx={{ marginRight: 'auto' }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Typography variant="body1">{name}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ paddingBottom: '8px', fontStyle: 'oblique' }}>
                                    {description}
                                </Typography>
                            </Grid>
                            {isEnabledShowMore ? (
                                <React.Fragment>
                                    <Grid item>
                                        <Typography variant="caption">Completed by:</Typography>
                                    </Grid>
                                    <Grid item sx={{ marginBottom: '8px' }}>
                                        <UserBubbleListButton userBubbles={MOCK_USERS} />
                                    </Grid>
                                    <Grid item>
                                        <Box sx={{ display: 'flex', marginBottom: '4px' }}>
                                            <IconButton onClick={handleToggleTaskStarred}>
                                                {isTaskStarred ? <StarIcon /> : <StarOutlineIcon />}
                                            </IconButton>
                                            <Tooltip
                                                title={'Starring a task can assist with filtering and organizing'}
                                                placement="right"
                                            >
                                                <InfoOutlinedIcon
                                                    sx={{
                                                        paddingLeft: '4px',
                                                        paddingRight: '8px',
                                                        paddingTop: '10px',
                                                        paddingBottom: '10px',
                                                    }}
                                                    fontSize="small"
                                                />
                                            </Tooltip>
                                            <Divider orientation="vertical" flexItem />
                                            <IconButton onClick={handleToggleTaskPinned}>
                                                {isTaskPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                                            </IconButton>
                                            <Tooltip
                                                title={'Pinning a task displays the task on your public profile'}
                                                placement="right"
                                            >
                                                <InfoOutlinedIcon
                                                    sx={{
                                                        paddingLeft: '4px',
                                                        paddingRight: '8px',
                                                        paddingTop: '10px',
                                                        paddingBottom: '10px',
                                                    }}
                                                    fontSize="small"
                                                />
                                            </Tooltip>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="caption">{dateDescription}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            sx={{ padding: '0px', textTransform: 'none' }}
                                            variant="text"
                                            onClick={toggleShowMore.bind(this, false)}
                                        >
                                            hide details
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            ) : (
                                <Grid item>
                                    <IconButton sx={{ padding: '0px' }} onClick={toggleShowMore.bind(this, true)}>
                                        <MoreHorizIcon />
                                    </IconButton>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        sx={{
                            padding: '8px',
                            borderRadius: '50%',
                            width: '54px',
                            textAlign: 'center',
                        }}
                    >
                        <Typography sx={{ fontSize: '1.5rem' }}>{numPoints}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
