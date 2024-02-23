import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, ButtonGroup } from '@mui/material';
import Constants from 'src/javascripts/Constants';
import ResourceClient from 'src/javascripts/clients/ResourceClient';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';

import type { IRootState } from 'src/javascripts/store';
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
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
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
                            /* eslint-disable @typescript-eslint/no-misused-promises */
                            onClick={async () => {
                                try {
                                    await ResourceClient.postResource(
                                        apiPathSelectReaction,
                                        {
                                            id: apiSelectReactionSourceEntityIdValue,
                                            reactionType,
                                        },
                                        sliceAuthenticationStateData.getJwtToken(),
                                    );
                                    handleUpdateCallback();
                                } catch (e: any) {}
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
