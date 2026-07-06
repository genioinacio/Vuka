const router = require("express").Router();
const auth   = require("../middlewares/authMiddleware");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

router.get("/", auth, async (req, res) => {
  const notifs = await prisma.notification.findMany({
    where:   { userId: req.userId },
    orderBy: { createdAt: "desc" },
    take:    50,
  });
  res.json(notifs);
});

router.put("/read-all", auth, async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.userId },
    data:  { lida: true },
  });
  res.json({ ok: true });
});

router.put("/:id/read", auth, async (req, res) => {
  const n = await prisma.notification.update({
    where: { id: req.params.id },
    data:  { lida: true },
  });
  res.json(n);
});

module.exports = router;