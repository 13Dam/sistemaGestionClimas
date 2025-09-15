import express from "express";
import { processData } from "../services/processor.js";
import { sendToFinalAPI } from "../services/httpClient.js";
import { logger } from "../middlewares/logger.js";

const router = express.Router();

///POST /webhook
 //Recibe datos del server, los procesa y los reenvía a la API final
router.post('/', async (req, res) => {
    try {
        const payload = req.body;

        //procesar el payload (validación, enriquecimiento, filtrado)
        const processedData = processData(payload);

        //reenviar a la API final
        // sendToFinalAPI debe ser una función async que haga el POST
        await sendToFinalAPI(processedData);

        //responder con éxito
        res.status(200).json({
            message: 'Payload procesado y reenviado correctamente',
            traceId: processedData.traceId,
        });
    } catch (err) {
        //log del error
        logger.error(err.message, { stack: err.stack });

        //responder con error
        res.status(400).json({
            message: 'Error procesando el payload',
            error: err.message,
        });
    }
});

export default router;
