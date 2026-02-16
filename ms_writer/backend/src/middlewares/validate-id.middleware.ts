import type { Request, Response, NextFunction } from "express";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    res.status(400).json({ error: "ID d'article manquant" });
    return;
  }

  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "ID d'article invalide" });
    return;
  }

  next();
};
