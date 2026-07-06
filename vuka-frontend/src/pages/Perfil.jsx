import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import useAuthStore from "../store/authStore";

function VukaLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M22 18 C28 28, 34 42, 50 72" stroke="#2D6A1F" strokeWidth="7" strokeLinecap="round"/>
      <path d="M78 18 C72 28, 66 42, 50 72" stroke="#2D6A1F" strokeWidth="7" strokeLinecap="round"/>
      <path d="M31 30 C36 24, 44 20, 50 18" stroke="#C0DD97" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M69 30 C64 24, 56 20, 50 18" stroke="#C0DD97" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="50" cy="72" r="4" fill="#C0DD97"/>
    </svg>
  );
}

export default function Perfil() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isOwner = user?.id === id;

  const { data: perfil, isLoading } = useQuery({
    queryKey: ["perfil", id],
    queryFn: () => api.get(`/users/${id}`).then(r => r.data),
  });

  const { data: postsData } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts").then(r => r.data),
  });

  const seguir = useMutation({
    mutationFn: () => api.post(`/users/${id}/follow`),
    onSuccess: () => queryClient.invalidateQueries(["perfil", id]),
  });

  const posts = postsData?.posts?.filter(p => p.user.id === id) || [];

  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: "#f4f7f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "14px" }}>
      A carregar perfil... 🌿
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7f2", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: "80px" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e8f0e0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(45,106,31,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 16px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/feed" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ width: "34px", height: "34px", background: "#EAF3DE", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <VukaLogo size={20} />
            </div>
            <span style={{ fontSize: "16px", fontWeight: "800", color: "#2D6A1F", letterSpacing: "3px" }}>VUKA</span>
          </Link>
          <Link to="/feed" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            ← Voltar ao feed
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Card do perfil */}
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

          {/* Cover */}
          <div style={{ height: "100px", background: "linear-gradient(135deg, #2D6A1F, #1B4D3E)" }} />

          <div style={{ padding: "0 20px 20px" }}>
            {/* Avatar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-30px", marginBottom: "16px" }}>
              <div style={{ width: "64px", height: "64px", background: "#EAF3DE", borderRadius: "50%", border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "800", color: "#2D6A1F" }}>
                {perfil?.nome?.charAt(0).toUpperCase()}
              </div>
              {!isOwner && (
                <button onClick={() => seguir.mutate()}
                  style={{ background: "#2D6A1F", color: "#fff", border: "none", borderRadius: "10px", padding: "9px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                  Seguir
                </button>
              )}
            </div>

            {/* Info */}
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#1f2937", marginBottom: "4px" }}>{perfil?.nome}</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>📍 {perfil?.regiao}</p>
            {perfil?.bio && <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", marginBottom: "16px" }}>{perfil.bio}</p>}

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
              {[
                { label: "Posts", valor: perfil?._count?.posts || 0 },
                { label: "Seguidores", valor: perfil?._count?.followers || 0 },
                { label: "Seguindo", valor: perfil?._count?.following || 0 },
                { label: "Pontos 🌿", valor: perfil?.pontos || 0 },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "12px 8px", background: "#f9fafb", borderRadius: "12px" }}>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#2D6A1F" }}>{s.valor}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts */}
        <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Publicações ({posts.length})
        </h3>

        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px", background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0" }}>
            Ainda sem publicações 🌱
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.7" }}>{post.texto}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: "13px", color: "#9ca3af" }}>❤️ {post._count.likes}</span>
                <span style={{ fontSize: "13px", color: "#9ca3af" }}>💬 {post._count.comments}</span>
                <span style={{ fontSize: "12px", color: "#d1d5db", marginLeft: "auto" }}>{new Date(post.createdAt).toLocaleDateString("pt-MZ")}</span>
              </div>
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