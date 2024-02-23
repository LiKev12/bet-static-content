import { ThemeProvider } from '@mui/material/styles';
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
import PrivateRoutes from 'src/javascripts/components/PrivateRoutes';

function App(): any {
    console.log('[theme]', THEME);
    return (
        <ThemeProvider theme={THEME}>
            <Header />
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="/me" element={<PagePersonal />} />
                    <Route path="/profiles/:id" element={<PageUser />} />
                    <Route path="/discover" element={<PageDiscover />} />
                    <Route path="/pods/:id" element={<PagePod />} />
                    <Route path="/stamps/:id" element={<PageStamp />} />
                </Route>
                <Route path={'/'} element={<PageHome />} />
                <Route path="/about" element={<div>About</div>} />
                <Route path="/contact" element={<div>Contact</div>} />
                {/** need auth */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
