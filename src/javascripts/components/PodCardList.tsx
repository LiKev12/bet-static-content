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
                    <Grid item key={podCard.id} sx={{ marginBottom: '16px', marginRight: '16px' }}>
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
