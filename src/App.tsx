import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainLayout } from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Studio from "./pages/Studio";
import Knowledge from "./pages/Knowledge";
import Playground from "./pages/Playground";
import Explore from "./pages/Explore";
import "./index.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "studio", element: <Studio /> },
      { path: "explore", element: <Explore /> },
      { path: "knowledge", element: <Knowledge /> },
      { path: "playground", element: <Playground /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
