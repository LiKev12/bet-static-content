import React, { useState } from 'react';
import { Button } from '@mui/material';
import CreateTaskModal from 'src/javascripts/components/CreateTaskModal';

export interface ICreateTaskModalButtonProps {
    idPod: string | null;
    handleUpdate: any;
}

const CreateTaskModalButton: React.FC<ICreateTaskModalButtonProps> = (props: ICreateTaskModalButtonProps) => {
    const { idPod, handleUpdate } = props;
    const [isModalOpen, setModalOpen] = useState(false);

    return (
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
                />
            ) : null}
        </React.Fragment>
    );
};
export default CreateTaskModalButton;
