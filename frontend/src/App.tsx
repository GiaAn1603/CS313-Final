import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout";
import { ScrollToTop } from "./components/scroll-to-top";
import { ThemeProvider } from "./context/theme-provider";
import { AboutUs } from "./pages/about-us";
import { CityPage } from "./pages/city-page";
import { Prediction } from "./pages/prediction";
import { StormTracks } from "./pages/storm-tracks";
import { StormsList } from "./pages/storms-list";
import { WeatherDashboard } from "./pages/weather-dashboard";
import { YearsOverview } from "./pages/years-overview";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider defaultTheme="dark">
          <Layout>
            <Routes>
              <Route path="/" element={<WeatherDashboard />} />
              <Route path="/city/:cityName" element={<CityPage />} />
              <Route path="/data" element={<YearsOverview />} />
              <Route path="/data/storms-list/:year" element={<StormsList />} />
              <Route path="/data/storm-tracks/:stormID" element={<StormTracks />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/about-us" element={<AboutUs />} />
            </Routes>
          </Layout>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
