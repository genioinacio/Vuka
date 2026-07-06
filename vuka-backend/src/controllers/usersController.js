const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getProfile(req, res) {
  const user = await prisma.user.findUnique({
    where:  { id: req.params.id },
    select: {
      id: true, nome: true, bio: true, regiao: true,
      avatarUrl: true, pontos: true, nivel: true, createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });

  if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });
  return res.json(user);
}

async function updateProfile(req, res) {
  const { nome, bio, regiao } = req.body;
  const avatarUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const user = await prisma.user.update({
    where:  { id: req.userId },
    data:   { nome, bio, regiao, ...(avatarUrl && { avatarUrl }) },
    select: { id: true, nome: true, bio: true, regiao: true, avatarUrl: true },
  });

  return res.json(user);
}

async function toggleFollow(req, res) {
  const seguidorId = req.userId;
  const seguindoId = req.params.id;

  if (seguidorId === seguindoId)
    return res.status(400).json({ error: "Não podes seguir-te a ti próprio." });

  const existente = await prisma.follow.findUnique({
    where: { seguidorId_seguindoId: { seguidorId, seguindoId } },
  });

  if (existente) {
    await prisma.follow.delete({ where: { id: existente.id } });
    return res.json({ following: false });
  }

  await prisma.follow.create({ data: { seguidorId, seguindoId } });
  return res.json({ following: true });
}

module.exports = { getProfile, updateProfile, toggleFollow };