import { createContext, useContext, type PropsWithChildren } from 'react';

const ColorModeContext = createContext({
  colorMode: 'dark',
  toggleColorMode: () => { },
});

export function ColorModeProvider(props: PropsWithChildren) {
  const { children } = props;
  return (
    <ColorModeContext.Provider value={{ colorMode: 'dark', toggleColorMode: () => { } }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? light : dark;
}
