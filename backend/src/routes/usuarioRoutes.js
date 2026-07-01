import express from "express";
import {
  listarUsuarios,
  criarUsuario
} from "../controllers/usuarioController.js";

import { autenticar } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", autenticar, listarUsuarios);
router.post("/", autenticar, criarUsuario);

export default router;