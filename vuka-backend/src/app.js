const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rotas
app.use("/auth",          require("./routes/auth"));
app.use("/posts",         require("./routes/posts"));
app.use("/users",         require("./routes/users"));
app.use("/challenges",    require("./routes/challenges"));
app.use("/events",        require("./routes/events"));
app.use("/communities",   require("./routes/communities"));
app.use("/notifications", require("./routes/notifications"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", app: "Vuka API 🌿" });
});

// Handler de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor." });
});

module.exports = app;