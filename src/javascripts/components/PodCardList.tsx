import React from 'react';
import type { IPodCardProps } from 'src/javascripts/components/PodCard';
import PodCard from 'src/javascripts/components/PodCard';
import { Grid } from '@mui/material';

export interface IPodCardListProps {
    podCards: IPodCardProps[];
}

const PodCardList: React.FC<IPodCardListProps> = (props: IPodCardListProps) => {
    const { podCards } = props;
    return (
        <React.Fragment>
            <Grid container direction="row">
                {podCards.map((podCard, idx: number) => (
                    <Grid item key={podCard.id} sx={{ margin: '16px 16px 16px 0px' }}>
                        <PodCard
                            key={`${idx}_${podCard.id}`}
                            id={podCard.id}
                            name={podCard.name}
                            description={podCard.description}
                            imagePath={podCard.imagePath}
                        />
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    );
};

export default PodCardList;
