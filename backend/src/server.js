import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    sistema: "FortisPricing API",
    status: "online",
    fase: "Fase 2",
    sprint: "Sprint 5"
  });
});

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`FortisPricing API rodando na porta ${PORT}`);
});