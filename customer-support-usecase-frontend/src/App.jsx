import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import MainView from "./components/MainView.jsx";
import ManageContexts from "./components/Contexts/ContextOptions.jsx";

const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    fontFamily: ["Intel", "IntelBold"].join(","),
    fontSize: 12,
  },
  palette: {
    primary: {
      main: "#2155BF",
      sidebar: "#0054ae",
      dim: "#f7f7f7",
      name: "#034387",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});
const RoutesJSX = (
  <>
    <Route
      exact
      path="/"
      element={<MainView />}
      loader={async ({ params }) => {
        return {};
      }}
    />
    <Route exact path="/manageContexts/" element={<ManageContexts />} />
  </>
);
const routes = createRoutesFromElements(RoutesJSX);
const router = createBrowserRouter(routes);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
