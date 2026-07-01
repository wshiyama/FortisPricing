import prisma from "../database/prisma.js";

const perfisPermitidos = [
  "VENDEDOR",
  "TECNICO_COMERCIAL",
  "GESTOR",
  "DIRETOR"
];

export async function listarUsuarios(req, res) {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { id: "asc" }
  });

  res.json(usuarios);
}

export async function criarUsuario(req, res) {
  const { nome, email, senha, perfil } = req.body;

  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({ erro: "Dados obrigatórios ausentes." });
  }

  if (!perfisPermitidos.includes(perfil)) {
    return res.status(400).json({ erro: "Perfil inválido." });
  }

  const usuario = await prisma.usuario.create({
    data: { nome, email, senha, perfil }
  });

  res.status(201).json(usuario);
}