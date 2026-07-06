import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../services/api";
import VukaLogo from "../components/VukaLogo";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      navigate("/feed");
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    border: "1.5px solid #e5e7eb", borderRadius: "12px",
    fontSize: "14px", outline: "none", background: "#fafafa",
    boxSizing: "border-box", color: "#1f2937",
    fontFamily: "inherit",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8faf6",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        background: "#ffffff", borderRadius: "24px",
        boxShadow: "0 4px 32px rgba(45,106,31,0.10), 0 1px 4px rgba(0,0,0,0.04)",
        padding: "48px 40px", width: "100%", maxWidth: "420px",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
          <VukaLogo size={36} horizontal={true} />
        </div>
        <p style={{ textAlign: "center", fontSize: "13px", color: "#9ca3af", fontWeight: "300", marginBottom: "40px", letterSpacing: "0.5px" }}>
          Acorda. Age. Transforma.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Email</label>
            <input name="email" type="email" placeholder="genio@vuka.co.mz"
              value={form.email} onChange={handleChange} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#2D6A1F"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Senha</label>
            <input name="senha" type="password" placeholder="••••••••"
              value={form.senha} onChange={handleChange} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#2D6A1F"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>
          {erro && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#dc2626" }}>
              ⚠️ {erro}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: loading ? "#86a87a" : "#2D6A1F", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginTop: "4px", letterSpacing: "0.3px" }}
            onMouseEnter={e => !loading && (e.target.style.background = "#1B4D3E")}
            onMouseLeave={e => !loading && (e.target.style.background = "#2D6A1F")}
          >
            {loading ? "A entrar..." : "🌿 Entrar"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#9ca3af", marginTop: "28px" }}>
          Não tens conta?{" "}
          <Link to="/cadastro" style={{ color: "#2D6A1F", fontWeight: "700", textDecoration: "none" }}>Criar conta</Link>
        </p>
      </div>
    </div>
  );
}