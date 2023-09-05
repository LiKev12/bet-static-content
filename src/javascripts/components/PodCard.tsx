import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    // Grid,
    // IconButton,
    Typography,
} from '@mui/material';
import LogoWithNameAndSlogan from 'src/assets/logo_with_slogan.png';
import { Link } from 'react-router-dom';

export interface IPodCardProps {
    id: string;
    name: string;
    description: string;
    imagePath?: string;
}

const PodCard: React.FC<IPodCardProps> = (props: IPodCardProps) => {
    const {
        id,
        name,
        description,
        // imagePath
    } = props;

    return (
        <Card
            sx={{
                border: '1px solid blue',
                width: '300px',
            }}
        >
            <CardContent>
                <Link to={`/pods/${id}`}>
                    <CardMedia
                        sx={{ height: '160px', cursor: 'pointer' }}
                        image={LogoWithNameAndSlogan}
                        title="green iguana"
                    />
                </Link>
                <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {name}
                </Typography>
                <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {description}
                </Typography>
                <Box>
                    <CardActions
                        sx={{
                            // width: '100%',
                            paddingLeft: '0px',
                            paddingRight: '0px',
                            justifyContent: 'center',
                            // display: 'flex',
                        }}
                    >
                        <Button
                            variant="contained"
                            size="small"
                            component={Link}
                            to={`/pods/${id}`}
                            sx={{ width: '100%' }}
                        >
                            View
                        </Button>
                    </CardActions>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PodCard;
