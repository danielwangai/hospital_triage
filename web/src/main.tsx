import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ManageTriage from "./pages/ManageTriage/ManageTriage.tsx";
import {LiveQueue} from "./pages/LiveQueue/LiveQueue.tsx";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        path: "/",
        element: <LiveQueue />,
      },
      {
        path: "/triage",
        element: <ManageTriage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
