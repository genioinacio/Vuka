import { create } from "zustand";

// Zustand é a nossa ferramenta de estado global
// Guarda as informações do utilizador logado em memória
// Assim qualquer página acede ao utilizador sem precisar
// de passar props de componente em componente

const useAuthStore = create((set) => ({
  // Estado inicial — utilizador não está logado
  user: null,
  token: localStorage.getItem("vuka_token") || null,
  isAuthenticated: !!localStorage.getItem("vuka_token"),

  // Acção de login — guarda o utilizador e o token
  // O token é guardado no localStorage para persistir
  // mesmo quando o utilizador fecha o browser
  login: (user, token) => {
    localStorage.setItem("vuka_token", token);
    set({ user, token, isAuthenticated: true });
  },

  // Acção de logout — remove tudo
  logout: () => {
    localStorage.removeItem("vuka_token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Actualiza os dados do utilizador sem fazer logout
  setUser: (user) => set({ user }),
}));

export default useAuthStore;