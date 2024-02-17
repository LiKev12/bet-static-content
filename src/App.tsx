import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { THEME } from 'src/javascripts/Theme';
import Header from 'src/javascripts/components/Header';
import { Route, Routes } from 'react-router-dom';
import PageNotFound from 'src/javascripts/components/PageNotFound';
import PageHome from 'src/javascripts/components/PageHome';
import PagePersonal from 'src/javascripts/components/PagePersonal';
import PagePod from 'src/javascripts/components/PagePod';
import PageStamp from 'src/javascripts/components/PageStamp';
import PageDiscover from 'src/javascripts/components/PageDiscover';
import PageUser from 'src/javascripts/components/PageUser';
import store from 'src/javascripts/store';

function App(): any {
    const [activeTabIdx, setActiveTabIdx] = useState(0);
    console.log('[theme]', THEME);

    // const navigate = useNavigate();
    // const customAuthHandler = (): void => {
    //     navigate('/login');
    // };
    // const restoreOriginalUri = async (_oktaAuth: any, originalUri: string): Promise<any> => {
    //     navigate(
    //         toRelativeUrl(
    //             originalUri !== '' && originalUri !== null && originalUri !== undefined ? originalUri : '/',
    //             window.location.origin,
    //         ),
    //         { replace: true },
    //     );
    // };
    return (
        <Provider store={store}>
            <ThemeProvider theme={THEME}>
                {/* <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}> */}
                <Header activeTabIdx={activeTabIdx} setActiveTabIdx={setActiveTabIdx} />
                <Routes>
                    {/* TODO: remove */}
                    {/* <Route path="/login" element={<LoginWidget config={oktaConfig} />} />
                    <Route path="/login/callback" element={<LoginCallback />} /> */}
                    <Route path="/" element={<PageHome />} />
                    <Route path="/about" element={<div>About</div>} />
                    <Route path="/contact" element={<div>Contact</div>} />
                    {/** need auth */}
                    <Route path="/me" element={<PagePersonal />} />
                    <Route path="/profiles/:id" element={<PageUser />} />
                    <Route path="/discover" element={<PageDiscover />} />
                    <Route path="/pods/:id" element={<PagePod />} />
                    <Route path="/stamps/:id" element={<PageStamp />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
                {/* </Security> */}
            </ThemeProvider>
        </Provider>
    );
}

export default App;
