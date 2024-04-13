import * as React from 'react';
import { THEME } from 'src/javascripts/Theme';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// @ts-expect-error no relevant type
import SwipeableViews from 'react-swipeable-views-react-18-fix';

export interface IImageWithLabelProps {
    image: any;
    label: string;
}
export interface ISwipeableTextMobileStepperProps {
    imagesWithLabels: IImageWithLabelProps[];
}

const SwipeableTextMobileStepper: React.FC<ISwipeableTextMobileStepperProps> = (
    props: ISwipeableTextMobileStepperProps,
) => {
    const { imagesWithLabels } = props;
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = imagesWithLabels.length;

    const handleNext = (): void => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = (): void => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number): void => {
        setActiveStep(step);
    };

    return (
        <Box
            sx={{
                maxWidth: 720,
                flexGrow: 1,
                border: `4px solid ${String(THEME.palette.other.formBorderColor)}`,
            }}
        >
            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    // minHeight: 50,
                    padding: '8px',
                    pl: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Typography>{imagesWithLabels[activeStep].label}</Typography>
            </Paper>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {imagesWithLabels.map((step, index) => (
                    <div key={step.label}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Box
                                component="img"
                                sx={{
                                    height: '100%',
                                    display: 'block',
                                    maxWidth: 720,
                                    overflow: 'hidden',
                                    width: '100%',
                                }}
                                src={step.image}
                                alt={step.label}
                            />
                        ) : null}
                    </div>
                ))}
            </SwipeableViews>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                        Next
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Back
                    </Button>
                }
            />
        </Box>
    );
};

export default SwipeableTextMobileStepper;
