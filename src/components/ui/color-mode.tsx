import { createContext, useContext } from 'react';

const ColorModeContext = createContext({
  colorMode: 'dark',
  toggleColorMode: () => {},
});

export function ColorModeProvider(props) {
  const { children } = props;
  return (
    <ColorModeContext.Provider value={{ colorMode: 'dark', toggleColorMode: () => {} }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? light : dark;
}
