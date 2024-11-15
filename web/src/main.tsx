import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Root from './Root.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const queryClient = new QueryClient();
const router = createBrowserRouter([{
    path: "/",
    element: <Root />,
    children: [
        {
            index: true,
            path: "/",
            element: <h1>Live Queue</h1>,
        },
        {
            path: "/triage",
            element: <h1>Manage Triage Steps</h1>,
        }
    ]
}])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      </QueryClientProvider>
    {/*<Root />*/}
  </StrictMode>,
)
