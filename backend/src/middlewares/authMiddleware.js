import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não informado." });
  }

  const partes = authHeader.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({ erro: "Token inválido." });
  }

  const token = partes[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email,
      perfil: decoded.perfil
    };

    next();
  } catch {
    return res.status(401).json({ erro: "Token expirado ou inválido." });
  }
}