import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";

function VukaLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M22 18 C28 28, 34 42, 50 72" stroke="#2D6A1F" strokeWidth="7" strokeLinecap="round"/>
      <path d="M78 18 C72 28, 66 42, 50 72" stroke="#2D6A1F" strokeWidth="7" strokeLinecap="round"/>
      <path d="M31 30 C36 24, 44 20, 50 18" stroke="#C0DD97" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M69 30 C64 24, 56 20, 50 18" stroke="#C0DD97" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M37 44 C41 38, 46 34, 50 32" stroke="#C0DD97" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M63 44 C59 38, 54 34, 50 32" stroke="#C0DD97" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <circle cx="50" cy="72" r="4" fill="#C0DD97"/>
    </svg>
  );
}

const categorias = ["Plantio", "Reciclagem", "Limpeza", "Energia", "Água", "Fauna"];
const categoriaIcon = { Plantio: "🌳", Reciclagem: "♻️", Limpeza: "🧹", Energia: "☀️", Água: "💧", Fauna: "🐾" };

// Modal de comentários
function ModalComentarios({ postId, onClose }) {
  const [texto, setTexto] = useState("");
  const queryClient = useQueryClient();

  const { data: comentarios, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => api.get(`/posts/${postId}/comments`).then(r => r.data),
  });

  const enviar = useMutation({
    mutationFn: () => api.post(`/posts/${postId}/comments`, { texto }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      queryClient.invalidateQueries(["posts"]);
      setTexto("");
    },
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: "24px 24px 0 0",
        width: "100%", maxWidth: "600px",
        padding: "24px", maxHeight: "70vh",
        display: "flex", flexDirection: "column", gap: "16px",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "15px", fontWeight: "700", color: "#1f2937" }}>💬 Comentários</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9ca3af" }}>×</button>
        </div>

        {/* Lista de comentários */}
        <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          {isLoading ? (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>A carregar...</p>
          ) : comentarios?.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>Sem comentários ainda. Sê o primeiro! 🌱</p>
          ) : (
            comentarios.map(c => (
              <div key={c.id} style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", background: "#EAF3DE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "#2D6A1F", flexShrink: 0 }}>
                  {c.user.nome?.charAt(0).toUpperCase()}
                </div>
                <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "10px 14px", flex: 1 }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#2D6A1F" }}>{c.user.nome}</span>
                  <p style={{ fontSize: "13px", color: "#374151", marginTop: "4px", lineHeight: "1.5" }}>{c.texto}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input de comentário */}
        <div style={{ display: "flex", gap: "10px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
          <input
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Escreve um comentário..."
            onKeyDown={e => e.key === "Enter" && texto.trim() && enviar.mutate()}
            style={{
              flex: 1, padding: "12px 16px", border: "1.5px solid #e5e7eb",
              borderRadius: "12px", fontSize: "13px", outline: "none",
            }}
            onFocus={e => e.target.style.borderColor = "#2D6A1F"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
          <button onClick={() => texto.trim() && enviar.mutate()}
            disabled={!texto.trim() || enviar.isPending}
            style={{
              background: "#2D6A1F", color: "#fff", border: "none",
              borderRadius: "12px", padding: "0 18px", fontSize: "13px",
              fontWeight: "600", cursor: "pointer",
            }}>
            {enviar.isPending ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Feed() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [novoPost, setNovoPost] = useState("");
  const [categoria, setCategoria] = useState("");
  const [filtro, setFiltro] = useState("");
  const [postComentando, setPostComentando] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts").then(r => r.data),
  });

  const criarPost = useMutation({
    mutationFn: (dados) => api.post("/posts", dados),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setNovoPost("");
      setCategoria("");
    },
  });

  const curtir = useMutation({
    mutationFn: (id) => api.post(`/posts/${id}/like`),
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });

  const posts = data?.posts || [];
  const postsFiltrados = filtro ? posts.filter(p => p.categoria === filtro) : posts;

  const acaoStyle = (cor = "#6b7280", bg = "transparent") => ({
    display: "flex", alignItems: "center", gap: "7px",
    background: "none", border: "none", fontSize: "13px",
    color: cor, cursor: "pointer", padding: "8px 14px",
    borderRadius: "10px", fontWeight: "500", transition: "background 0.15s",
  });

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
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {[
              { to: "/notificacoes", icon: "🔔" },
              { to: "/desafios", icon: "🏆" },
              { to: "/eventos", icon: "🗺️" },
              { to: "/comunidades", icon: "👥" },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ padding: "8px", borderRadius: "10px", textDecoration: "none", fontSize: "18px" }}
                onMouseEnter={e => e.currentTarget.style.background = "#EAF3DE"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >{item.icon}</Link>
            ))}
            <Link to={`/perfil/${user?.id}`} style={{ width: "34px", height: "34px", background: "#2D6A1F", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "#fff", textDecoration: "none", marginLeft: "4px" }}>
              {user?.nome?.charAt(0).toUpperCase()}
            </Link>
            <button onClick={logout} style={{ background: "none", border: "none", fontSize: "12px", color: "#9ca3af", cursor: "pointer", padding: "4px 8px" }}>Sair</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Criar post */}
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", background: "#2D6A1F", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <textarea value={novoPost} onChange={e => setNovoPost(e.target.value)}
              placeholder="Partilha uma acção ambiental... 🌿" maxLength={280}
              style={{ flex: 1, border: "none", outline: "none", resize: "none", fontSize: "14px", color: "#374151", minHeight: "70px", fontFamily: "inherit", lineHeight: "1.6", background: "transparent" }}
            />
          </div>
          <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
              {categorias.map(c => (
                <button key={c} onClick={() => setCategoria(categoria === c ? "" : c)}
                  style={{ padding: "5px 12px", borderRadius: "999px", fontSize: "12px", border: `1px solid ${categoria === c ? "#C0DD97" : "#e5e7eb"}`, background: categoria === c ? "#EAF3DE" : "#f9f9f9", color: categoria === c ? "#2D6A1F" : "#6b7280", fontWeight: categoria === c ? "600" : "400", cursor: "pointer" }}>
                  {categoriaIcon[c]} {c}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>{novoPost.length}/280</span>
              <button onClick={() => novoPost.trim() && criarPost.mutate({ texto: novoPost, categoria })}
                disabled={!novoPost.trim() || criarPost.isPending}
                style={{ padding: "9px 20px", background: novoPost.trim() ? "#2D6A1F" : "#d1d5db", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: novoPost.trim() ? "pointer" : "not-allowed" }}>
                {criarPost.isPending ? "..." : "Publicar 🌿"}
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {["Todos", ...categorias].map(c => (
            <button key={c} onClick={() => setFiltro(c === "Todos" ? "" : (filtro === c ? "" : c))}
              style={{ padding: "7px 14px", borderRadius: "999px", fontSize: "12px", whiteSpace: "nowrap", border: `1px solid ${(c === "Todos" && !filtro) || filtro === c ? "#C0DD97" : "#e5e7eb"}`, background: (c === "Todos" && !filtro) || filtro === c ? "#EAF3DE" : "#fff", color: (c === "Todos" && !filtro) || filtro === c ? "#2D6A1F" : "#6b7280", fontWeight: (c === "Todos" && !filtro) || filtro === c ? "600" : "400", cursor: "pointer" }}>
              {c !== "Todos" && categoriaIcon[c]} {c}
            </button>
          ))}
        </div>

        {/* Posts */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>A carregar... 🌿</div>
        ) : postsFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>Nenhum post ainda. Sê o primeiro! 🌱</div>
        ) : (
          postsFiltrados.map(post => (
            <div key={post.id} style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e8f0e0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <Link to={`/perfil/${post.user.id}`} style={{ width: "42px", height: "42px", background: "#EAF3DE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#2D6A1F", textDecoration: "none", flexShrink: 0 }}>
                  {post.user.nome?.charAt(0).toUpperCase()}
                </Link>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#1f2937" }}>{post.user.nome}</span>
                    {post.categoria && (
                      <span style={{ fontSize: "11px", background: "#EAF3DE", color: "#2D6A1F", padding: "2px 8px", borderRadius: "999px", fontWeight: "600" }}>
                        {categoriaIcon[post.categoria]} {post.categoria}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>{post.user.regiao} · {new Date(post.createdAt).toLocaleDateString("pt-MZ")}</span>
                </div>
              </div>

              {/* Texto */}
              <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.7", marginBottom: post.imagemUrl ? "14px" : "0" }}>{post.texto}</p>

              {/* Imagem */}
              {post.imagemUrl && (
                <img src={`http://localhost:3000${post.imagemUrl}`} alt="post"
                  style={{ width: "100%", borderRadius: "14px", marginTop: "12px", objectFit: "cover", maxHeight: "320px" }}
                />
              )}

              {/* Acções */}
              <div style={{ display: "flex", gap: "4px", paddingTop: "14px", marginTop: "14px", borderTop: "1px solid #f3f4f6" }}>

                {/* Curtir */}
                <button onClick={() => curtir.mutate(post.id)}
                  style={acaoStyle("#e55")}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  ❤️ <span>{post._count.likes}</span>
                </button>

                {/* Comentar */}
                <button onClick={() => setPostComentando(post.id)}
                  style={acaoStyle("#3b82f6")}
                  onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  💬 <span>{post._count.comments}</span>
                </button>

                {/* Partilhar */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                    alert("Link copiado! 🌿");
                  }}
                  style={acaoStyle("#2D6A1F")}
                  onMouseEnter={e => e.currentTarget.style.background = "#EAF3DE"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  🔗 <span>Partilhar</span>
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal comentários */}
      {postComentando && (
        <ModalComentarios postId={postComentando} onClose={() => setPostComentando(null)} />
      )}

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