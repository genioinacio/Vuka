const router = require("express").Router();
const auth   = require("../middlewares/authMiddleware");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

router.get("/nearby", auth, async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { data: "asc" },
    where:   { data: { gte: new Date() } },
  });
  res.json(events);
});

router.post("/", auth, async (req, res) => {
  const { titulo, descricao, tipo, lat, lng, data } = req.body;
  if (!titulo || !tipo || !lat || !lng || !data)
    return res.status(400).json({ error: "Campos obrigatórios em falta." });

  const event = await prisma.event.create({
    data: { titulo, descricao, tipo, lat, lng, data: new Date(data), criadoPor: req.userId },
  });
  res.status(201).json(event);
});

module.exports = router;