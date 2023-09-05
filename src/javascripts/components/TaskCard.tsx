import React, { useState } from 'react';
import { Button, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { THEME } from 'src/javascripts/Theme';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export interface ITaskCardProps {
    id: string;
    name: string;
    description: string;
    numPoints: number;
    imagePath: string;
    isComplete: boolean;
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
    let dateDescription = `created ${dateCreated}`;
    if (dateUpdated !== null) {
        dateDescription += ` · updated ${dateUpdated}`;
    }
    if (dateTargeted !== null) {
        dateDescription += ` · target ${dateTargeted}`;
    }
    if (dateCompleted !== null) {
        dateDescription += ` · completed ${dateCompleted}`;
    }
    return dateDescription;
};

const TaskCard: React.FC<ITaskCardProps> = (props: ITaskCardProps) => {
    const [isEnabledShowMore, toggleShowMore] = useState(false);
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
        <Card sx={{ fontFamily: 'Raleway', color: THEME.palette.grey.A700, marginBottom: '16px', width: '650px' }}>
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
