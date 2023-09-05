import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';

import { THEME } from 'src/javascripts/Theme';
import Header from 'src/javascripts/components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from 'src/javascripts/components/PageNotFound';
import PageHome from 'src/javascripts/components/PageHome';
import PageMe from 'src/javascripts/components/PageMe';
import PagePod from 'src/javascripts/components/PagePod';
import PageStamp from 'src/javascripts/components/PageStamp';
import PageDiscover from 'src/javascripts/components/PageDiscover';

function App(): any {
    const [activeTabIdx, setActiveTabIdx] = useState(0);
    console.log('[theme]', THEME);

    return (
        <ThemeProvider theme={THEME}>
            <BrowserRouter>
                <Header activeTabIdx={activeTabIdx} setActiveTabIdx={setActiveTabIdx} />
                <Routes>
                    <Route path="/" element={<PageHome />} />
                    <Route path="/about" element={<div>About</div>} />
                    <Route path="/contact" element={<div>Contact</div>} />
                    {/** need auth */}
                    <Route path="/me" element={<PageMe />} />
                    <Route path="/profiles" element={<div>Profile</div>} />
                    <Route path="/discover" element={<PageDiscover id="temp_id" />} />
                    <Route path="/pods/:id" element={<PagePod id="temp_id" />} />
                    <Route path="/stamps/:id" element={<PageStamp id="temp_id" />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
