import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import VukaLogo from "../components/VukaLogo";

export default function Comunidades() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: comunidades, isLoading } = useQuery({
    queryKey: ["comunidades"],
    queryFn: () => api.get("/communities").then(r => r.data),
  });

  const entrar = useMutation({
    mutationFn: (id) => api.post(`/communities/${id}/join`),
    onSuccess: () => queryClient.invalidateQueries(["comunidades"]),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf6", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: "80px" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e8f0e0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(45,106,31,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 16px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/feed" style={{ textDecoration: "none" }}>
            <VukaLogo size={22} horizontal={true} />
          </Link>
          <Link to="/feed" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}>← Voltar</Link>
        </div>
      </nav>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>

        <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#1f2937" }}>👥 Comunidades</h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "-8px" }}>Junta-te a grupos de acção ambiental em Moçambique.</p>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>A carregar... 🌿</div>
        ) : !comunidades || comunidades.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#9ca3af", fontSize: "14px", background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
            <p style={{ fontWeight: "600", color: "#6b7280", marginBottom: "4px" }}>Nenhuma comunidade ainda</p>
            <p style={{ fontSize: "12px" }}>Em breve teremos comunidades para te juntares!</p>
          </div>
        ) : (
          comunidades.map(c => (
            <div key={c.id} style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <div style={{ width: "48px", height: "48px", background: "#EAF3DE", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                    {c.icone || "🌿"}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1f2937" }}>{c.nome}</h3>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>👥 {c._count.membros} membros</p>
                  </div>
                </div>
                <button onClick={() => entrar.mutate(c.id)}
                  style={{ background: "#2D6A1F", color: "#fff", border: "none", borderRadius: "10px", padding: "9px 18px", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                  onMouseEnter={e => e.target.style.background = "#1B4D3E"}
                  onMouseLeave={e => e.target.style.background = "#2D6A1F"}
                >
                  Entrar
                </button>
              </div>
              {c.descricao && (
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.6", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
                  {c.descricao}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Navbar móvel */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e8f0e0", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 0 12px", zIndex: 100, boxShadow: "0 -2px 12px rgba(0,0,0,0.06)" }}>
        {[
          { to: "/feed", icon: "🏠", label: "Feed" },
          { to: "/desafios", icon: "🏆", label: "Desafios" },
          { to: "/eventos", icon: "🗺️", label: "Eventos" },
          { to: "/comunidades", icon: "👥", label: "Grupos" },
          { to: `/perfil/${user?.id}`, icon: "👤", label: "Perfil" },
        ].map(item => (
          <Link key={item.to} to={item.to} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", textDecoration: "none", padding: "4px 8px" }}>
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "500" }}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}