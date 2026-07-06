import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";

// QueryClient — gere o cache das chamadas à API
// Por exemplo, se o feed já foi carregado, não volta a
// buscar os dados desnecessariamente enquanto estiverem frescos
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // dados frescos por 5 minutos
      retry: 1, // tenta apenas 1 vez em caso de erro
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);