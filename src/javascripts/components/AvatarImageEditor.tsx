import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Box, Modal, Slider, Button, Typography } from '@mui/material';

const boxStyle = {
    width: '300px',
    height: '300px',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};
const modalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

export interface ICropperModalProps {
    src: any;
    modalOpen: boolean;
    setModalOpen: any;
    imageUploadHandler: any;
}

// Modal
const CropperModal: React.FC<ICropperModalProps> = (props: ICropperModalProps) => {
    const { src, modalOpen, setModalOpen, imageUploadHandler } = props;
    const [slideValue, setSlideValue] = useState(10);
    const cropRef = useRef(null);

    const handleSave = async (): Promise<any> => {
        // @ts-expect-error expected
        const imageAsBase64String = cropRef.current.getImage().toDataURL();
        imageUploadHandler(imageAsBase64String);
        setModalOpen(false);
    };

    return (
        <Modal sx={modalStyle} open={modalOpen}>
            <Box sx={boxStyle}>
                <AvatarEditor
                    ref={cropRef}
                    image={src}
                    style={{ width: '100%', height: '100%' }}
                    border={50}
                    borderRadius={150}
                    color={[0, 0, 0, 0.72]}
                    scale={slideValue / 10}
                    rotate={0}
                />

                {/* MUI Slider */}
                <Slider
                    min={10}
                    max={50}
                    sx={{
                        margin: '0 auto',
                        width: '80%',
                        color: 'cyan',
                    }}
                    size="medium"
                    defaultValue={slideValue}
                    value={slideValue}
                    onChange={(e: any) => {
                        setSlideValue(e.target.value);
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        padding: '10px',
                        border: '3px solid white',
                        background: 'black',
                    }}
                >
                    <Button
                        size="small"
                        sx={{ marginRight: '10px', color: 'white', borderColor: 'white' }}
                        variant="outlined"
                        onClick={(e) => setModalOpen(false)}
                    >
                        cancel
                    </Button>
                    <Button
                        sx={{ background: '#5596e6' }}
                        size="small"
                        variant="contained"
                        onClick={() => {
                            void handleSave();
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export interface IAvatarImageEditorProps {
    imageUploadHandler: any;
    imageLink: string | null;
}

// Container
const AvatarImageEditor: React.FC<IAvatarImageEditorProps> = (props: IAvatarImageEditorProps) => {
    const { imageLink, imageUploadHandler } = props;
    // image src
    const [src, setSrc] = useState<string | null>(null);
    const [isAvatarHover, setAvatarHover] = useState(false);
    // modal state
    const [modalOpen, setModalOpen] = useState(false);
    // ref to control input element
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputClick = (e: any): void => {
        e.preventDefault();
        if (inputRef.current !== null) {
            inputRef.current.click();
        }
    };

    const handleImgChange = (e: any): void => {
        if (e.target.files.length > 0) {
            const imageFile = e.target.files[0];
            setSrc(URL.createObjectURL(imageFile));
            setModalOpen(true);
        }
    };

    return (
        <React.Fragment>
            <CropperModal
                modalOpen={modalOpen}
                src={src}
                setModalOpen={setModalOpen}
                imageUploadHandler={imageUploadHandler}
            />
            <Box sx={{ display: 'none' }}>
                <input type="file" accept="image/*" ref={inputRef} onChange={handleImgChange} />
            </Box>
            <Box
                sx={{ border: '2px solid black', width: '300px', height: '300px', borderRadius: '50%' }}
                className="img-container"
                onMouseEnter={(e: any) => {
                    setAvatarHover(true);
                }}
                onMouseLeave={(e: any) => {
                    setAvatarHover(false);
                }}
                onClick={handleInputClick}
            >
                <Box
                    component="img"
                    sx={{
                        borderRadius: '50%',
                        width: '300px',
                        height: '300px',
                        opacity: isAvatarHover ? 0.4 : 1,
                        cursor: 'pointer',
                    }}
                    alt="avatar-image"
                    src={imageLink ?? 'https://www.signivis.com/img/custom/avatars/member-avatar-01.png'}
                />
                {isAvatarHover ? (
                    <Box
                        sx={{
                            position: 'relative',
                            bottom: '50%',
                            left: '25%',
                            cursor: 'pointer',
                        }}
                    >
                        <Typography>Click to change image</Typography>
                    </Box>
                ) : null}
            </Box>
        </React.Fragment>
    );
};

// Ex: https://codesandbox.io/s/react-avatar-editor-example-bvbqyb?file=/src/Cropper.jsx
export default AvatarImageEditor;
