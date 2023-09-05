import React from 'react';
import type { IStampCardProps } from 'src/javascripts/components/StampCard';
import StampCard from 'src/javascripts/components/StampCard';
import { Grid } from '@mui/material';

export interface IStampCardListProps {
    stampCards: IStampCardProps[];
}

const StampCardList: React.FC<IStampCardListProps> = (props: IStampCardListProps) => {
    const { stampCards } = props;
    return (
        <React.Fragment>
            <Grid container direction="row">
                {stampCards.map((stampCard, idx: number) => (
                    <Grid item key={stampCard.id} sx={{ margin: '16px 16px 16px 0px' }}>
                        <StampCard
                            key={`${idx}_${stampCard.id}`}
                            id={stampCard.id}
                            name={stampCard.name}
                            description={stampCard.description}
                            imagePath={stampCard.imagePath}
                        />
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    );
};

export default StampCardList;
