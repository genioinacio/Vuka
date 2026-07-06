const router = require("express").Router();
const auth   = require("../middlewares/authMiddleware");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

router.get("/", auth, async (req, res) => {
  const desafios = await prisma.challenge.findMany({ orderBy: { pontos: "desc" } });
  res.json(desafios);
});

router.get("/:id/progress", auth, async (req, res) => {
  const p = await prisma.userProgress.findUnique({
    where: { userId_challengeId: { userId: req.userId, challengeId: req.params.id } },
  });
  res.json(p || { progresso: 0, concluido: false });
});

router.put("/:id/progress", auth, async (req, res) => {
  const { progresso } = req.body;
  if (typeof progresso !== "number")
    return res.status(400).json({ error: "Progresso inválido." });

  const challenge = await prisma.challenge.findUnique({ where: { id: req.params.id } });
  if (!challenge) return res.status(404).json({ error: "Desafio não encontrado." });

  const concluido = progresso >= challenge.total;

  const p = await prisma.userProgress.upsert({
    where:  { userId_challengeId: { userId: req.userId, challengeId: req.params.id } },
    update: { progresso, concluido },
    create: { userId: req.userId, challengeId: req.params.id, progresso, concluido },
  });

  if (concluido) {
    await prisma.user.update({
      where: { id: req.userId },
      data:  { pontos: { increment: challenge.pontos } },
    });
  }

  res.json(p);
});

module.exports = router;