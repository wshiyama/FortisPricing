import express from "express";

import {
  listarUsuarios,
  criarUsuario
} from "../controllers/usuarioController.js";

import { autenticar } from "../middlewares/authMiddleware.js";
import { permitirPerfis } from "../middlewares/permissaoMiddleware.js";
import { PERFIS } from "../config/perfis.js";

const router = express.Router();

router.get(
  "/",
  autenticar,
  permitirPerfis([PERFIS.GESTOR, PERFIS.DIRETOR]),
  listarUsuarios
);

router.post(
  "/",
  autenticar,
  permitirPerfis([PERFIS.DIRETOR]),
  criarUsuario
);

export default router;