import { Router } from "express";
import { validatePayload, normalize } from "../utils/validator.js";
import { forwardToApi } from "../services/forwarder.js";
import logger from "../utils/logger.js";

export const router = Router();

// Recibe datos desde MS2
router.post("/", async (req, res, next) => {
  try {
    const { valid, errors } = validatePayload(req.body);
    if (!valid) {
      logger.warn("Invalid payload", { errors });
      return res.status(400).json({ errors });
    }

    const normalized = normalize(req.body);
    const result = await forwardToApi(normalized);

    return res.status(202).json({ status: "accepted", forwarded: true, result });
  } catch (err) {
    return next(err);
  }
});
