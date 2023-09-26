import { createTheme } from '@mui/material/styles';
import '@mui/material/styles/createPalette';

// // https://github.com/mui/material-ui/issues/21310
// // https://stackoverflow.com/questions/68430166/how-to-add-custom-colors-name-on-material-ui-with-typescript
// declare module '@mui/material/styles/createPalette' {
//     interface CommonColors {
//         white: string;
//     }
// }

const THEME: any = createTheme({
    palette: {
        primary: {
            main: '#02b9ff',
            contrastText: '#fff',
        },
        secondary: {
            main: '#02ffc7',
        },
        // @ts-expect-error expected
        gradient: 'linear-gradient(90deg, rgba(229,255,249,1) 50%, rgba(192,237,255,1) 100%)',
    },
});

THEME.palette.grey.A500 = '#979797';
export { THEME };
