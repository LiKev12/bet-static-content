import React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import Constants from 'src/javascripts/Constants';
import ResourceClient from 'src/javascripts/clients/ResourceClient';

export interface IReactionSelectorProps {
    handleUpdateCallback: any;
    apiPathSelectReaction: string;
    apiSelectReactionSourceEntityIdValue: string;
    myReaction: string | null;
}

export interface IReactionSelectorState {
    selectedReactionType: string | null;
}

const ReactionSelector: React.FC<IReactionSelectorProps> = (props: IReactionSelectorProps) => {
    const { handleUpdateCallback, apiPathSelectReaction, apiSelectReactionSourceEntityIdValue, myReaction } = props;

    return (
        <Box>
            <ButtonGroup variant="contained">
                {Constants.REACTION_TYPES.map((reactionType: string, idx: number) => {
                    return (
                        <Button
                            key={`reaction_emoji_${String(idx)}_${String(reactionType)}`}
                            color={'primary'}
                            sx={{
                                padding: '0px 8px',
                                fontSize: '20px',
                                ...(myReaction === reactionType ? { backgroundColor: '#fff59d' } : {}),
                            }}
                            onClick={() => {
                                ResourceClient.postResource(apiPathSelectReaction, {
                                    id: apiSelectReactionSourceEntityIdValue,
                                    reactionType: reactionType === myReaction ? null : reactionType,
                                })
                                    .then(() => {
                                        handleUpdateCallback();
                                    })
                                    .catch(() => {});
                            }}
                        >
                            {Constants.GET_EMOJI_HTML_FROM_REACTION(reactionType)}
                        </Button>
                    );
                })}
            </ButtonGroup>
        </Box>
    );
};

export default ReactionSelector;
