import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { THEME } from 'src/javascripts/Theme';
import Header from 'src/javascripts/components/Header';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PageNotFound from 'src/javascripts/components/PageNotFound';
import PageHome from 'src/javascripts/components/PageHome';
import PagePersonal from 'src/javascripts/components/PagePersonal';
import PagePod from 'src/javascripts/components/PagePod';
import PageStamp from 'src/javascripts/components/PageStamp';
import PageDiscover from 'src/javascripts/components/PageDiscover';
import PageAccountSettings from 'src/javascripts/components/PageAccountSettings';
import PageUser from 'src/javascripts/components/PageUser';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';

import type { IRootState } from 'src/javascripts/store';

function App(): any {
    console.log('[theme]', THEME);
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    let routerChildren;
    if (sliceAuthenticationStateData.hasJwtToken()) {
        routerChildren = [
            { path: '/', element: <PageHome /> },
            { path: '/me', element: <PagePersonal /> },
            { path: '/discover', element: <PageDiscover /> },
            { path: '/account', element: <PageAccountSettings /> },
            { path: '/profiles/:id', element: <PageUser /> },
            { path: '/pods/:id', element: <PagePod /> },
            { path: '/stamps/:id', element: <PageStamp /> },
        ];
    } else {
        routerChildren = [{ path: '/', element: <PageHome /> }];
    }
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Header />,
            errorElement: <PageNotFound />,
            children: routerChildren,
        },
    ]);

    return (
        <ThemeProvider theme={THEME}>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
