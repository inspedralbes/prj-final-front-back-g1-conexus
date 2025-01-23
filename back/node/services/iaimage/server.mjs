import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from 'url';
import { encode } from 'gpt-tokenizer';
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from 'express-fileupload';
const path = require('path');
const dotenv = require('dotenv');

function loadEnv(envPath) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
      throw result.error;
  }
  return result.parsed; 
}

const iaimgEnd = loadEnv(path.resolve(__dirname, './.env'));


const app = express();
const port = iaimgEnd.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});
app.use(fileUpload());


const genAI = new GoogleGenerativeAI(iaimgEnd.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


function extractJsonContent(responseText) {
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    return responseText.substring(jsonStart, jsonEnd);
}

let totalTokensAcumulados = 0;
app.get("/", (req, res) => {
    res.send("Hello World! I am an image service");
});
app.post("/classify-image", async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: "No se recibió ningún archivo." });
        }

        const imageFile = req.files.image;
        const mimeType = imageFile.mimetype;
        const imageBuffer = imageFile.data;

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType,
            },
        };

        const prompt = `Eres un detector de imágenes en binario. Para cada imagen que te pase, debes clasificarla en una de las siguientes categorías:

        ADECUADA:
        
        La imagen no contiene ningún contenido inapropiado, tales como:
        Bullying.
        Violencia.
        Imágenes sexualizadas o inapropiadas.
        Desnudos parciales o totales.
        Actos sexuales, posiciones sugestivas o ambientes eróticos.
        Cosificación de personas (enfoque vulgar en partes del cuerpo).
        Contenido inapropiado para menores (ropa muy reveladora, insinuaciones sexuales).
        OFENSIVA:
        
        La imagen contiene:
        Odio, discriminación, amenazas o violencia.
        Representaciones religiosas inapropiadas.
        Actos sexuales explícitos o simulados.
        Personas en situaciones íntimas (contacto físico sugestivo, ropa desabrochada, cuerpos entrelazados).
        Contenido vulgar o degradante.
        POTENCIALMENTE_SUGERENTE:
        
        La imagen presenta algunas características que podrían ser inapropiadas pero no cumplen con todas las condiciones para clasificarse como OFENSIVA.
        Ejemplos incluyen:
        Besos apasionados o caricias íntimas.
        Ropa ajustada o algo reveladora, pero no explícita.
        Posiciones corporales ambiguas.
        Contextos que sugieren contenido erótico sin ser explícito.
        
        POTENCIALMENTE_SUGERENTE:
        
        Se introduce una subclasificación:
        OFENSIVO: Si la imagen potencialmente sugerente cruza ciertos límites y se acerca a lo inapropiado u ofensivo.
        Ejemplo: Besos muy intensos, ropa extremadamente reveladora o insinuaciones sexuales claras.
        NO_OFENSIVO: Si la imagen sugiere cierta ambigüedad pero no es explícita ni puede considerarse inapropiada.
        Ejemplo: Ropa ajustada moderadamente, poses ambiguas pero no vulgares.
        
        {
          "category": "ADECUADA" | "OFENSIVA" | "POTENCIALMENTE_SUGERENTE",
          "subcategory": "OFENSIVO" | "NO_OFENSIVO",
          "image": "Aquí va la URL de la imagen",
          "reason": "Explicación de por qué es sugerente y si cruza límites ofensivos. Que se muestre en catalan"
        }
        
        
        Por mas ofensivo que sea una imagen devuelve por lo menos un mensaje de error.`;

        const promptTokens = encode(prompt).length;

        const result = await model.generateContent([prompt, imagePart]);

        const responseText = result.response.text();

        const responseTokens = encode(responseText).length;

        const totalTokens = promptTokens + responseTokens;

        totalTokensAcumulados += totalTokens;

        console.log(`Tokens del prompt: ${promptTokens}`);
        console.log(`Tokens de la respuesta: ${responseTokens}`);
        console.log(`Total de tokens acumulados: ${totalTokensAcumulados}`);

        const jsonResponse = extractJsonContent(responseText);

        console.log("Clasificación de la imagen:");
        console.log(jsonResponse);

        res.json(JSON.parse(jsonResponse));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Hubo un error procesando la imagen." });
    }
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});