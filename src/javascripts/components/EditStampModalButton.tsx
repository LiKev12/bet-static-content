import React, { useState } from 'react';
import { Button } from '@mui/material';
import EditStampModal from 'src/javascripts/components/EditStampModal';

export interface IEditStampModalButtonProps {
    idStamp: string;
}

const EditStampModalButton: React.FC<IEditStampModalButtonProps> = (props: IEditStampModalButtonProps) => {
    const { idStamp } = props;
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
                {'Edit Stamp'}
            </Button>
            {isModalOpen ? (
                <EditStampModal
                    idStamp={idStamp}
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                />
            ) : null}
        </React.Fragment>
    );
};
export default EditStampModalButton;
