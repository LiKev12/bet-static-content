import {
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

export interface IStampCardProps {
    id: string;
    name: string;
    description: string;
    imagePath?: string;
}

const StampCard: React.FC<IStampCardProps> = (props: IStampCardProps) => {
    const {
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
                <CardMedia
                    sx={{ height: '160px', cursor: 'pointer' }}
                    image={LogoWithNameAndSlogan}
                    title="green iguana"
                />
                <Typography variant="body1">{name}</Typography>
                <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {description}
                </Typography>
                <CardActions>
                    <Button size="small">View</Button>
                </CardActions>
            </CardContent>
        </Card>
    );
};

export default StampCard;
