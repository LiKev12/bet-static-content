import { Box, Typography } from '@mui/material';
import { THEME } from 'src/javascripts/Theme';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
    return (
        <Box
            style={{
                minHeight: '100vh',
                background: THEME.palette.other.gradient,
                paddingLeft: '36px',
                paddingTop: '36px',
            }}
        >
            <Typography variant="h4">
                Page not found. Please ensure the URL is correct or go back <Link to="/">here</Link>.
            </Typography>
        </Box>
    );
};

export default PageNotFound;
