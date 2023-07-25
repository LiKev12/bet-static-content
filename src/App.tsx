import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';

import { THEME } from 'src/javascripts/Theme';
import Header from 'src/javascripts/components/Header';
import Footer from 'src/javascripts/components/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from 'src/javascripts/components/PageNotFound';
import PageHome from 'src/javascripts/components/PageHome';

function App(): any {
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    return (
        <ThemeProvider theme={THEME}>
            <BrowserRouter>
                <Header activeTabIdx={activeTabIdx} setActiveTabIdx={setActiveTabIdx} />
                <Routes>
                    <Route path="/" element={<PageHome />} />
                    <Route path="/about" element={<div>About</div>} />
                    <Route path="/contact" element={<div>Contact</div>} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
                <Footer setActiveTabIdx={setActiveTabIdx} />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
