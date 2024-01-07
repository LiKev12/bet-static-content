import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
// import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';

export interface IOktaSignInWidgetProps {
    config: any;
    onSuccess: any;
    onError: any;
}

const OktaSignInWidget: React.FC<IOktaSignInWidgetProps> = ({ config, onSuccess, onError }: IOktaSignInWidgetProps) => {
    const widgetRef = useRef();
    useEffect(() => {
        if (widgetRef.current === null || widgetRef.current === undefined) {
            return;
        }
        const widget = new OktaSignIn(config);

        widget
            .showSignInToGetTokens({
                el: widgetRef.current,
            })
            .then(onSuccess)
            .catch(onError);
        return (): void => {
            widget.remove();
        };
    }, [onSuccess, onError, config]);

    return (
        <Box>
            <Box ref={widgetRef}></Box>
        </Box>
    );
};
export default OktaSignInWidget;
