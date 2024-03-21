import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { THEME } from 'src/javascripts/Theme';
import Header from 'src/javascripts/components/Header';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PageNotFound from 'src/javascripts/components/PageNotFound';
// import PageNotFoundAsErrorElement from 'src/javascripts/components/PageNotFoundAsErrorElement';
import ErrorBoundaryFallbackComponent from 'src/javascripts/components/ErrorBoundaryFallbackComponent';
import PageHome from 'src/javascripts/components/PageHome';
import PageAbout from 'src/javascripts/components/PageAbout';
import PageContact from 'src/javascripts/components/PageContact';
import PagePersonal from 'src/javascripts/components/PagePersonal';
import PagePod from 'src/javascripts/components/PagePod';
import PageStamp from 'src/javascripts/components/PageStamp';
import PageDiscover from 'src/javascripts/components/PageDiscover';
import PageAccountSettings from 'src/javascripts/components/PageAccountSettings';
import PageUser from 'src/javascripts/components/PageUser';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';
// import { ErrorBoundary } from 'react-error-boundary';
import type { IRootState } from 'src/javascripts/store';

function App(): any {
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    let routerChildren;
    if (sliceAuthenticationStateData.hasJwtToken()) {
        routerChildren = [
            { path: '/', element: <PageHome /> },
            { path: '/about', element: <PageAbout /> },
            { path: '/contact', element: <PageContact /> },
            { path: '/me', element: <PagePersonal /> },
            { path: '/discover', element: <PageDiscover /> },
            { path: '/account', element: <PageAccountSettings /> },
            { path: '/profiles/:id', element: <PageUser /> },
            { path: '/pods/:id', element: <PagePod /> },
            { path: '/stamps/:id', element: <PageStamp /> },
            { path: '/page-not-found', element: <PageNotFound /> },
            { path: '*', element: <PageNotFound /> },
        ];
    } else {
        routerChildren = [
            { path: '/', element: <PageHome /> },
            { path: '/about', element: <PageAbout /> },
            { path: '/contact', element: <PageContact /> },
            { path: '/page-not-found', element: <PageNotFound /> },
            { path: '*', element: <PageNotFound /> },
        ];
    }
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Header />,
            errorElement: <ErrorBoundaryFallbackComponent />,
            children: routerChildren,
        },
    ]);

    return (
        // <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
        <ThemeProvider theme={THEME}>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
