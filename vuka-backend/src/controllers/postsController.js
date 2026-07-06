const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const postSchema = z.object({
  texto:       z.string().min(1).max(280),
  categoria:   z.string().optional(),
  challengeId: z.string().optional(),
});

async function list(req, res) {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;

  const posts = await prisma.post.findMany({
    skip:    (page - 1) * limit,
    take:    limit,
    orderBy: { createdAt: "desc" },
    include: {
      user:   { select: { id: true, nome: true, avatarUrl: true, regiao: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return res.json({ posts, page, limit });
}

async function create(req, res) {
  const result = postSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });

  const { texto, categoria, challengeId } = result.data;
  const imagemUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const post = await prisma.post.create({
    data:    { texto, categoria, challengeId, imagemUrl, userId: req.userId },
    include: { user: { select: { id: true, nome: true, avatarUrl: true } } },
  });

  return res.status(201).json(post);
}

async function toggleLike(req, res) {
  const { id: postId } = req.params;
  const userId = req.userId;

  // Busca o post para saber o dono
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { userId: true },
  });

  if (!post) return res.status(404).json({ error: "Post não encontrado." });

  const existente = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existente) {
    await prisma.like.delete({ where: { id: existente.id } });
    return res.json({ liked: false });
  }

  // Cria o like
  await prisma.like.create({ data: { userId, postId } });

  // Envia notificação ao dono do post (se não for o próprio)
  if (post.userId !== userId) {
    const quemCurtiu = await prisma.user.findUnique({
      where: { id: userId },
      select: { nome: true },
    });

    await prisma.notification.create({
      data: {
        userId:   post.userId,
        tipo:     "like",
        mensagem: `${quemCurtiu.nome} curtiu o teu post 💚`,
      },
    });
  }

  return res.json({ liked: true });
}

async function listComments(req, res) {
  const comments = await prisma.comment.findMany({
    where:   { postId: req.params.id },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, nome: true, avatarUrl: true } } },
  });
  return res.json(comments);
}

async function addComment(req, res) {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: "Texto obrigatório." });

  const comment = await prisma.comment.create({
    data:    { texto, userId: req.userId, postId: req.params.id },
    include: { user: { select: { id: true, nome: true, avatarUrl: true } } },
  });

  // Busca o post para notificar o dono
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
    select: { userId: true },
  });

  // Notifica o dono do post (se não for o próprio)
  if (post && post.userId !== req.userId) {
    await prisma.notification.create({
      data: {
        userId:   post.userId,
        tipo:     "comment",
        mensagem: `${comment.user.nome} comentou no teu post 💬`,
      },
    });
  }

  return res.status(201).json(comment);
}

module.exports = { list, create, toggleLike, listComments, addComment };