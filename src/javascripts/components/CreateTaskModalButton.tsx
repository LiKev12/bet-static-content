import React, { useState } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import CreateTaskModal from 'src/javascripts/components/CreateTaskModal';

export interface ICreateTaskModalButtonProps {
    idPod: string | null;
    handleUpdate: any;
    isDisabled: boolean;
    disabledTooltipMessage: string | null;
}

const CreateTaskModalButton: React.FC<ICreateTaskModalButtonProps> = (props: ICreateTaskModalButtonProps) => {
    const { idPod, handleUpdate, isDisabled, disabledTooltipMessage } = props;
    const [isModalOpen, setModalOpen] = useState(false);

    return isDisabled ? (
        <Tooltip title={disabledTooltipMessage} placement="right">
            <Box>
                <Button variant="contained" sx={{ width: '100%' }} disabled={true}>
                    {'Create New Task'}
                </Button>
            </Box>
        </Tooltip>
    ) : (
        <React.Fragment>
            <Button
                variant="contained"
                sx={{ width: '100%' }}
                onClick={() => {
                    setModalOpen(true);
                }}
            >
                {'Create New Task'}
            </Button>
            {isModalOpen ? (
                <CreateTaskModal
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                    idPod={idPod}
                    handleUpdate={handleUpdate}
                    isDisabled={isDisabled}
                    disabledTooltipMessage={disabledTooltipMessage}
                />
            ) : null}
        </React.Fragment>
    );
};
export default CreateTaskModalButton;
