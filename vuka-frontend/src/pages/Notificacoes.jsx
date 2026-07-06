import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/services/api";
import useAuthStore from "@/store/authStore";
import VukaLogo from "@/components/VukaLogo";

export default function Notificacoes() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: notifs, isLoading } = useQuery({
    queryKey: ["notificacoes"],
    queryFn: () => api.get("/notifications").then(r => r.data),
    refetchInterval: 15000, // Actualiza a cada 15 segundos automaticamente
  });

  const marcarLida = useMutation({
    mutationFn: (id) => api.put(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries(["notificacoes"]),
  });

  const marcarTodas = useMutation({
    mutationFn: () => api.put("/notifications/read-all"),
    onSuccess: () => queryClient.invalidateQueries(["notificacoes"]),
  });

  const tipoIcon = {
    like: "❤️", comment: "💬", follow: "👤",
    challenge: "🏆", event: "📍", default: "🔔",
  };

  const naoLidas = notifs?.filter(n => !n.lida).length || 0;

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

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#1f2937" }}>🔔 Notificações</h1>
            {naoLidas > 0 && (
              <p style={{ fontSize: "12px", color: "#2D6A1F", marginTop: "2px" }}>{naoLidas} não lida{naoLidas > 1 ? "s" : ""}</p>
            )}
          </div>
          {naoLidas > 0 && (
            <button onClick={() => marcarTodas.mutate()}
              style={{ background: "#EAF3DE", border: "none", borderRadius: "10px", padding: "8px 14px", fontSize: "12px", color: "#2D6A1F", fontWeight: "600", cursor: "pointer" }}>
              ✓ Marcar todas
            </button>
          )}
        </div>

        {/* Lista */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>A carregar... 🌿</div>
        ) : !notifs || notifs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#9ca3af", fontSize: "14px", background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔔</div>
            <p style={{ fontWight: "600", color: "#6b7280", marginBottom: "4px" }}>Sem notificações ainda</p>
            <p style={{ fontSize: "12px" }}>Quando alguém curtir ou comentar o teu post, aparece aqui.</p>
          </div>
        ) : (
          notifs.map(n => (
            <div key={n.id} onClick={() => !n.lida && marcarLida.mutate(n.id)}
              style={{
                background: n.lida ? "#fff" : "#FAFFF6",
                border: `1px solid ${n.lida ? "#e8f0e0" : "#C0DD97"}`,
                borderRadius: "16px", padding: "16px",
                display: "flex", gap: "12px", alignItems: "flex-start",
                cursor: n.lida ? "default" : "pointer",
                transition: "all 0.15s",
              }}>
              {/* Ícone */}
              <div style={{ width: "44px", height: "44px", background: n.lida ? "#f3f4f6" : "#EAF3DE", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                {tipoIcon[n.tipo] || tipoIcon.default}
              </div>
              {/* Conteúdo */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", color: n.lida ? "#6b7280" : "#1f2937", fontWeight: n.lida ? "400" : "600", lineHeight: "1.5" }}>
                  {n.mensagem}
                </p>
                <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  {new Date(n.createdAt).toLocaleDateString("pt-MZ")} às {new Date(n.createdAt).toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {/* Indicador não lida */}
              {!n.lida && (
                <div style={{ width: "8px", height: "8px", background: "#2D6A1F", borderRadius: "50%", flexShrink: 0, marginTop: "6px" }} />
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