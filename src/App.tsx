import { ThemeProvider } from '@mui/material/styles';

import { THEME } from 'src/javascripts/Theme';
import Header from 'src/javascripts/components/Header';
import Footer from 'src/javascripts/components/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from 'src/javascripts/components/PageNotFound';

function App(): any {
    return (
        <ThemeProvider theme={THEME}>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<div>Home</div>} />
                    <Route path="/about" element={<div>About</div>} />
                    <Route path="/contact" element={<div>Contact</div>} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
