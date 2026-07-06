import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import VukaLogo from "../components/VukaLogo";

export default function Eventos() {
  const { user } = useAuthStore();
  const [inscrito, setInscrito] = useState({});

  const { data: eventos, isLoading } = useQuery({
    queryKey: ["eventos"],
    queryFn: () => api.get("/events/nearby").then(r => r.data),
  });

  const tipoIcon = { plantio: "🌳", limpeza: "🧹", energia: "☀️", educacao: "📚", reciclagem: "♻️" };
  const tipoCor = { plantio: "#EAF3DE", limpeza: "#E1F5EE", energia: "#FAEEDA", educacao: "#E8F0FE", reciclagem: "#E1F5EE" };

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

        <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#1f2937" }}>🗺️ Eventos Próximos</h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "-8px" }}>Acções ambientais perto de ti em Moçambique.</p>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>A carregar... 🌿</div>
        ) : !eventos || eventos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#9ca3af", fontSize: "14px", background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗺️</div>
            <p style={{ fontWeight: "600", color: "#6b7280", marginBottom: "4px" }}>Nenhum evento disponível ainda</p>
            <p style={{ fontSize: "12px" }}>Em breve teremos eventos na tua região!</p>
          </div>
        ) : (
          eventos.map(e => (
            <div key={e.id} style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", background: tipoCor[e.tipo] || "#EAF3DE", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                  {tipoIcon[e.tipo] || "📍"}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1f2937", marginBottom: "6px" }}>{e.titulo}</h3>
                  {e.descricao && <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.5", marginBottom: "10px" }}>{e.descricao}</p>}
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px" }}>
                      📅 {new Date(e.data).toLocaleDateString("pt-MZ")}
                    </span>
                    <span style={{ fontSize: "12px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px" }}>
                      👥 {e.inscritos + (inscrito[e.id] ? 1 : 0)} inscritos
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInscrito(prev => ({ ...prev, [e.id]: !prev[e.id] }))}
                style={{ width: "100%", marginTop: "14px", padding: "12px", background: inscrito[e.id] ? "#f3f4f6" : "#2D6A1F", color: inscrito[e.id] ? "#6b7280" : "#fff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.15s" }}>
                {inscrito[e.id] ? "✓ Inscrito" : "Inscrever-me"}
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