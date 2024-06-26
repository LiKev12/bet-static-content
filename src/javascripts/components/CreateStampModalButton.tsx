import React, { useState } from 'react';
import { Button } from '@mui/material';
import CreateStampModal from 'src/javascripts/components/CreateStampModal';

export interface ICreateStampModalButtonProps {
    idPod: string | null;
    sideEffect: any;
}

const CreateStampModalButton: React.FC<ICreateStampModalButtonProps> = (props: ICreateStampModalButtonProps) => {
    const { idPod, sideEffect } = props;
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <React.Fragment>
            <Button
                sx={{ width: '100%' }}
                variant="contained"
                onClick={() => {
                    setModalOpen(true);
                }}
            >
                {'Create new Stamp'}
            </Button>
            {isModalOpen ? (
                <CreateStampModal
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                    idPod={idPod}
                    sideEffect={sideEffect}
                />
            ) : null}
        </React.Fragment>
    );
};
export default CreateStampModalButton;
