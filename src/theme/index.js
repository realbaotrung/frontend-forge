import {
  extendTheme,
  // type ThemeConfig
} from '@chakra-ui/react';
import foundations from './foundations';
import components from './components';

// const config: ThemeConfig = {
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  ...foundations,
  components,
  config,
});

export default theme;
