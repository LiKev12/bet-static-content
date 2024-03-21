import React from 'react';
import { Box, Grid, Typography, List, ListItem } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import SwipeableTextMobileStepper from 'src/javascripts/components/SwipeableTextMobileStepper';
import PageAbout1a from 'src/assets/PageAbout1a.jpg';
import PageAbout1b from 'src/assets/PageAbout1b.jpg';
import PageAbout2a from 'src/assets/PageAbout2a.jpg';
import PageAbout2b from 'src/assets/PageAbout2b.jpg';
import PageAbout2c from 'src/assets/PageAbout2c.jpg';
import PageAbout3a from 'src/assets/PageAbout3a.jpg';
import PageAbout3b from 'src/assets/PageAbout3b.jpg';

const PageAbout: React.FC = () => {
    return (
        <Box
            style={{
                minHeight: '100vh',
                paddingLeft: '24px',
                paddingRight: '24px',
                background: THEME.palette.other.gradient,
            }}
        >
            <Grid container direction="column" sx={{ paddingLeft: '96px', paddingBottom: '96px' }}>
                <Grid item sx={{ marginBottom: '36px' }}>
                    <Grid container direction="row" spacing={2}>
                        {/* <Grid item xs={6}>
                            <Box
                                sx={{
                                    width: '800px',
                                    height: '800px',
                                    backgroundColor: 'blue',
                                }}
                            ></Box>
                        </Grid> */}
                        <Grid item xs={6}>
                            <SwipeableTextMobileStepper
                                imagesWithLabels={[
                                    { image: PageAbout1a, label: 'View real-time stats and trends for your progress' },
                                    {
                                        image: PageAbout1b,
                                        label: 'Designate points according to difficulty, importance, etc. - up to you!',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Typography variant="h2">Bet on Yourself</Typography>
                                </Grid>
                                <Grid item>
                                    <List
                                        sx={{
                                            listStyleType: 'disc',
                                            pl: 4,
                                        }}
                                    >
                                        <ListItem
                                            sx={{
                                                display: 'list-item',
                                            }}
                                        >
                                            <Typography variant="h4">
                                                A platform designed for all your to-do needs
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{ display: 'list-item' }}>
                                            <Typography variant="h4">
                                                Adopt a quantified-self approach to productivity
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid sx={{ marginBottom: '36px' }}>
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Typography variant="h2">Do More, Together with Friends</Typography>
                                </Grid>
                                <Grid item>
                                    <List
                                        sx={{
                                            listStyleType: 'disc',
                                            pl: 4,
                                        }}
                                    >
                                        <ListItem sx={{ display: 'list-item' }}>
                                            <Typography variant="h4">
                                                Join Pods with friends to encourage accountability
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{ display: 'list-item' }}>
                                            <Typography variant="h4">
                                                Discover popular interests and dive into hot trends
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <SwipeableTextMobileStepper
                                imagesWithLabels={[
                                    { image: PageAbout2a, label: 'Follow others who share similar interests' },
                                    {
                                        image: PageAbout2b,
                                        label: 'Create Tasks in Pods to coordinate shared activities',
                                    },
                                    {
                                        image: PageAbout2c,
                                        label: 'Support each other by engaging in comments and reactions',
                                    },
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid sx={{ marginBottom: '36px' }}>
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs={6}>
                            <SwipeableTextMobileStepper
                                imagesWithLabels={[
                                    {
                                        image: PageAbout3a,
                                        label: 'Create Stamps for anything and everything noteworthy - you decide!',
                                    },
                                    {
                                        image: PageAbout3b,
                                        label: 'Complete all Tasks to collect the Stamp',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Typography variant="h2">Share your Favorite Memories</Typography>
                                </Grid>
                                <Grid item>
                                    <List
                                        sx={{
                                            listStyleType: 'disc',
                                            pl: 4,
                                        }}
                                    >
                                        <ListItem
                                            sx={{
                                                display: 'list-item',
                                            }}
                                        >
                                            <Typography variant="h4">
                                                Collect Stamps to showcase your achievements
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{ display: 'list-item' }}>
                                            <Typography variant="h4">
                                                Game-ify your life: celebrate your proudest milestones
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageAbout;

/**
 * 
Gamify your Life, Bet on Yourself
- a platform designed for all your to-do needs
[]
- adopt a quantified self approach to productivity 
[productivity stats, rigged heatmap + line chart]: "see real-time stats and trends for the past year"

Do More, Together with Friends
- follow others who share similar interests 
[snapshot of someone's home page with 92 followers, 117 following, and interesting bio] "follow others who share similar interests"
- join Pods with friends to encourage accountability
[running club, long runs, short runs] "Create shared Tasks in Pods to stay organized"
- comment and react to engage with others
[comments/reactions on post about a hike, use pic from mt fremont pic with smileyface, "on top of the world!"] "Comment and react to engage with others"

[discover page pods, with both interests and new trends] "Discover popular interests and dive into hot trends"

Share your Proudest Milestones
- collect Stamps to showcase your accomplishments
[stamp bank with quarters, states, marathons, national parks, pokemon?] "Create Stamps for anything and everything"
- virtualize your favorite memories
[]
 */

/**
 * 
Bet on Yourself
- [productivity stats, rigged heatmap + line chart]: "see real-time stats and trends for your progress"
- [3 tasks, each with differing points] "Designate points for Tasks according to difficulty, importance, etc. - up to you!"

Do More, Together with Friends
- [snapshot of someone's home page with 92 followers, 117 following, and interesting bio] "follow others who share similar interests"
- [running club, long runs, short runs] "Create Tasks in Pods to coordinate shared activities"
- [comments/reactions on post about a hike, use pic from mt fremont pic with smileyface, "on top of the world!"] "Comment and react to engage with others"

Share your Favorite Memories
- [stamp bank with quarters, states, marathons, national parks, pokemon?] "Create Stamps for anything and everything noteworthy"
- [pinned task, but what] "Share highlights by pinning Tasks to your public profile"

TODO:
- finish About page finally
- bug: refresh page after becoming a member of a pod (so that you can complete tasks)
- no capital letters, . and _ ok handle
- add bottom border to comments
- 
 */
