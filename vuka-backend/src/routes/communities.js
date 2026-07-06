const router = require("express").Router();
const auth   = require("../middlewares/authMiddleware");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

router.get("/", auth, async (req, res) => {
  const communities = await prisma.community.findMany({
    include: { _count: { select: { membros: true } } },
  });
  res.json(communities);
});

router.post("/:id/join", auth, async (req, res) => {
  const existente = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId: req.userId, communityId: req.params.id } },
  });

  if (existente) {
    await prisma.communityMember.delete({ where: { id: existente.id } });
    return res.json({ joined: false });
  }

  await prisma.communityMember.create({
    data: { userId: req.userId, communityId: req.params.id },
  });
  res.json({ joined: true });
});

module.exports = router;