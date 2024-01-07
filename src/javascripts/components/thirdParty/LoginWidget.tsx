import { Box } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignInWidget from './OktaSignInWidget';

export interface ILoginWidgetProps {
    config: any;
}

const LoginWidget: React.FC<ILoginWidgetProps> = ({ config }: ILoginWidgetProps) => {
    const { oktaAuth, authState } = useOktaAuth();
    console.log({
        oktaAuth,
        authState,
        config,
    });
    const onSuccess = async (tokens: any): Promise<any> => {
        await oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err: Error): void => {
        console.log('Sign in error: ', err);
    };
    if (authState === null) {
        return <Box>loading</Box>;
    }

    return authState.isAuthenticated === true ? (
        <Navigate to={{ pathname: '/' }} />
    ) : (
        <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />
    );
};

export default LoginWidget;
