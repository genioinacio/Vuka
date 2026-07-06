import axios from "axios";

// Criamos uma instância do Axios apontando para o nosso back-end
// Assim não precisamos repetir a URL em cada chamada
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor — antes de cada pedido, adiciona automaticamente
// o token JWT no header Authorization
// Assim o utilizador não precisa de fazer login em cada página
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vuka_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta — se o servidor devolver 401 (não autorizado)
// significa que o token expirou — redireccionamos para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("vuka_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;