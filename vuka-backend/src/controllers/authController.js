const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const registerSchema = z.object({
  nome:   z.string().min(2, "Nome muito curto."),
  email:  z.string().email("Email inválido."),
  senha:  z.string().min(8, "Mínimo 8 caracteres."),
  regiao: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

async function register(req, res) {
  const result = registerSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });

  const { nome, email, senha, regiao } = result.data;

  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe)
    return res.status(409).json({ error: "Email já registado." });

  const senhaHash = await bcrypt.hash(senha, 10);
  const user = await prisma.user.create({
    data:   { nome, email, senhaHash, regiao },
    select: { id: true, nome: true, email: true, regiao: true, pontos: true, nivel: true },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(201).json({ user, token });
}

async function login(req, res) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });

  const { email, senha } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(senha, user.senhaHash)))
    return res.status(401).json({ error: "Credenciais inválidas." });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const { senhaHash, ...userSemSenha } = user;
  return res.json({ user: userSemSenha, token });
}

module.exports = { register, login };