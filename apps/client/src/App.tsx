import {
  Box,
  ColorScheme,
  MantineProvider,
  ColorSchemeProvider,
  useMantineTheme
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRoutes } from "react-router-dom";
import theme from "~/styles/theme";
import { getRoutes } from "./routes";
import { useUser } from "./hooks/useUser";
import { useLocalStorage } from "@mantine/hooks";
import { useColorAccent } from "./contexts/ColorAccentContext";

const queryClient = new QueryClient();

function Entry() {
  const { user } = useUser();
  const theme = useMantineTheme();
  const page = useRoutes(getRoutes(!!user));
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        background:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        overflowX: "hidden"
      }}
    >
      {page}
    </Box>
  );
}

export function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: false
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const { accentColor } = useColorAccent();

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ ...theme, colorScheme, primaryColor: accentColor }}
      >
        <QueryClientProvider client={queryClient}>
          <Entry />
          <Notifications position="top-right" />
        </QueryClientProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
