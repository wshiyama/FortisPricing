import prisma from "../database/prisma.js";
import { PERFIS_VALIDOS } from "../config/perfis.js";

export async function listarUsuarios(req, res) {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true
    }
  });

  res.json(usuarios);
}

export async function criarUsuario(req, res) {
  const { nome, email, senha, perfil } = req.body;

  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({ erro: "Dados obrigatórios ausentes." });
  }

  if (!PERFIS_VALIDOS.includes(perfil)) {
    return res.status(400).json({ erro: "Perfil inválido." });
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email }
  });

  if (usuarioExistente) {
    return res.status(409).json({ erro: "Email já cadastrado." });
  }

  const usuario = await prisma.usuario.create({
    data: { nome, email, senha, perfil },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true
    }
  });

  res.status(201).json(usuario);
}