import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import VukaLogo from "../components/VukaLogo";

export default function Desafios() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: desafios, isLoading } = useQuery({
    queryKey: ["desafios"],
    queryFn: () => api.get("/challenges").then(r => r.data),
  });

  const registar = useMutation({
    mutationFn: ({ id, progresso }) => api.put(`/challenges/${id}/progress`, { progresso }),
    onSuccess: () => queryClient.invalidateQueries(["desafios"]),
  });

  const categoriaIcon = { Plantio: "🌳", Reciclagem: "♻️", Limpeza: "🧹", Energia: "☀️", Água: "💧", Fauna: "🐾" };

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

        <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#1f2937" }}>🏆 Desafios Ecológicos</h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "-8px" }}>Completa desafios e ganha pontos de impacto ambiental.</p>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>A carregar... 🌿</div>
        ) : !desafios || desafios.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#9ca3af", fontSize: "14px", background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏆</div>
            <p style={{ fontWeight: "600", color: "#6b7280", marginBottom: "4px" }}>Nenhum desafio disponível ainda</p>
            <p style={{ fontSize: "12px" }}>Em breve teremos desafios para ti!</p>
          </div>
        ) : (
          desafios.map(d => (
            <div key={d.id} style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "44px", height: "44px", background: "#EAF3DE", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                    {categoriaIcon[d.categoria] || "🌿"}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1f2937" }}>{d.titulo}</h3>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>{d.categoria}</span>
                  </div>
                </div>
                <span style={{ background: "#EAF3DE", color: "#2D6A1F", borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap" }}>
                  +{d.pontos} pts
                </span>
              </div>

              <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.6", marginBottom: "16px" }}>{d.descricao}</p>

              {d.prazo && (
                <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "12px" }}>
                  ⏱ Prazo: {new Date(d.prazo).toLocaleDateString("pt-MZ")}
                </p>
              )}

              <button onClick={() => registar.mutate({ id: d.id, progresso: 1 })}
                style={{ width: "100%", padding: "12px", background: "#EAF3DE", color: "#2D6A1F", border: "1px solid #C0DD97", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.target.style.background = "#C0DD97"; }}
                onMouseLeave={e => { e.target.style.background = "#EAF3DE"; }}
              >
                ✅ Registar progresso
              </button>
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