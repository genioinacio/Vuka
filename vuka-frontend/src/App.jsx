import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

// Importação das Páginas usando o Alias @
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import Feed from "@/pages/Feed";
import Perfil from "@/pages/Perfil";
import Desafios from "@/pages/Desafios";
import Eventos from "@/pages/Eventos";
import Comunidades from "@/pages/Comunidades";
import Notificacoes from "@/pages/Notificacoes";

// ProtectedRoute — componente que protege as rotas privadas
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas protegidas */}
        <Route path="/feed" element={
          <ProtectedRoute><Feed /></ProtectedRoute>
        } />
        <Route path="/perfil/:id" element={
          <ProtectedRoute><Perfil /></ProtectedRoute>
        } />
        <Route path="/desafios" element={
          <ProtectedRoute><Desafios /></ProtectedRoute>
        } />
        <Route path="/eventos" element={
          <ProtectedRoute><Eventos /></ProtectedRoute>
        } />
        <Route path="/comunidades" element={
          <ProtectedRoute><Comunidades /></ProtectedRoute>
        } />
        <Route path="/notificacoes" element={
          <ProtectedRoute><Notificacoes /></ProtectedRoute>
        } />

        {/* Rota raiz */}
        <Route path="/" element={<Navigate to="/feed" />} />
      </Routes>
    </BrowserRouter>
  );
}