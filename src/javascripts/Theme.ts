import { createTheme } from '@mui/material/styles';
import '@mui/material/styles/createPalette';

// // https://github.com/mui/material-ui/issues/21310
// // https://stackoverflow.com/questions/68430166/how-to-add-custom-colors-name-on-material-ui-with-typescript
// declare module '@mui/material/styles/createPalette' {
//     interface CommonColors {
//         white: string;
//     }
// }

export const THEME: any = createTheme({
    palette: {
        primary: {
            main: '#02b9ff',
        },
        secondary: {
            main: '#02ffc7',
        },
    },
});
