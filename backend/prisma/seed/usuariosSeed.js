import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const usuarios = [
  {
    nome: "Vendedor Teste",
    email: "vendedor@fortis.com",
    senha: "123456",
    perfil: "VENDEDOR"
  },
  {
    nome: "Técnico Comercial Teste",
    email: "tecnico@fortis.com",
    senha: "123456",
    perfil: "TECNICO_COMERCIAL"
  },
  {
    nome: "Gestor Teste",
    email: "gestor@fortis.com",
    senha: "123456",
    perfil: "GESTOR"
  },
  {
    nome: "Diretor Teste",
    email: "diretor@fortis.com",
    senha: "123456",
    perfil: "DIRETOR"
  }
];

async function main() {
  for (const user of usuarios) {
    const senhaHash = await bcrypt.hash(user.senha, 10);

    await prisma.usuario.upsert({
      where: { email: user.email },
      update: {
        nome: user.nome,
        senha: senhaHash,
        perfil: user.perfil,
        ativo: true
      },
      create: {
        nome: user.nome,
        email: user.email,
        senha: senhaHash,
        perfil: user.perfil,
        ativo: true
      }
    });
  }

  console.log("Usuários iniciais criados com sucesso.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });