import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { encode } from 'gpt-tokenizer';
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function generateContentWithRetry(model, prompt, imagePart, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent([prompt, imagePart]);
            return result;
        } catch (error) {
            if (error.status === 503 && i < retries - 1) {
                console.warn(`Service unavailable, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                throw error;
            }
        }
    }
}

let totalTokensAcumulados = 0;
app.get("/", (req, res) => {
    res.send("Hello World! I am an image service");
});
app.post("/classify-imageOffers", async (req, res) => {
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

        const prompt = `Eres un detector de imágenes en binario. Para cada imagen que te pase, debes clasificarla en una de las siguientes categorías y subcategorías:

        ADECUADA:
        La imagen no contiene ningún contenido inapropiado, tales como:

        Bullying.
        Violencia.
        Imágenes sexualizadas o inapropiadas.
        Desnudos parciales o totales.
        Actos sexuales, posiciones sugestivas o ambientes eróticos.
        Cosificación de personas (enfoque vulgar en partes del cuerpo).
        Contenido inapropiado para menores (ropa muy reveladora, insinuaciones sexuales).
        Personajes históricos que hayan cometido actos violentos o inapropiados o genocidios, pero están acompañados con un texto explicando que se estudia su historia.
        No contiene selfies, independientemente de quién las tome.
        No contiene rostros de personas no famosas, independientemente de su expresión facial (felicidad, tristeza, neutralidad, etc.), del entorno (conferencia, evento público, grupo social, etc.), o del contexto en el que se encuentren.
        Si son famosos (streamers, youtubers, tiktokers, etc.), no están en situaciones explícitas, vulgares, degradantes o inapropiadas.
        Si sin famosos y se ven microfonos, cámaras, etc., no están en situaciones explícitas, vulgares, degradantes o inapropiadas.
        OFENSIVA:
        La imagen contiene:

        Odio, discriminación, amenazas o violencia.
        Representaciones religiosas inapropiadas.
        Actos sexuales explícitos o simulados.
        Personas en situaciones íntimas (contacto físico sugestivo, ropa desabrochada, cuerpos entrelazados).
        Contenido vulgar o degradante.
        Personajes históricos que hayan cometido actos violentos o inapropiados o genocidios.
        Cualquier imagen que muestre rostros de personas no famosas, independientemente de la expresión facial, del entorno (incluso en conferencias, eventos públicos o con otras personas), o del contexto.
        Cualquier tipo de selfie, independientemente de quién la tome.
        Toda imagen que contenga contenido sexual o erótico, incluso si no es explícito, se clasifica automáticamente como ofensiva.
        Personas no famosas: Toda imagen con personas no famosas se clasifica automáticamente como ofensiva.

        
        POTENCIALMENTE_SUGERENTE:
        La imagen presenta algunas características que podrían ser inapropiadas pero no cumplen con todas las condiciones para clasificarse como OFENSIVA. Ejemplos incluyen:

        Besos apasionados o caricias íntimas.
        Ropa ajustada o algo reveladora, pero no explícita.
        Posiciones corporales ambiguas.
        Contextos que sugieren contenido erótico sin ser explícito.
        Subcategorías específicas:
        Para personas famosas:
        FAMOSOS_ADECUADA: La imagen muestra personas famosas, incluyendo streamers, youtubers y tiktokers, en contextos adecuados, sin contenido sugerente o inapropiado (Los famosos atecuados puede ser streamers, youtubers y de Tik Tok).
        FAMOSOS_SUGERENTE: La imagen muestra personas famosas en situaciones ambiguas o contextos que podrían ser interpretados como sugerentes, pero no son explícitamente ofensivos.
        FAMOSOS_OFENSIVO: La imagen muestra personas famosas en situaciones explícitas, vulgares, degradantes o en contextos inapropiados.
        FAMOSOS_POTENCIALMENTE_SUGERENTE: La imagen muestra personas famosas en situaciones ambiguas o contextos que podrían ser interpretados como sugerentes, pero no son explícitamente ofensivos.
        Para personas no famosas:
        DESCONOCIDOS_ADECUADA: (No válida) Las imágenes con personas no famosas, independientemente del contexto, no son consideradas adecuadas.
        DESCONOCIDOS_POTENCIALMENTE_SUGERENTE: La imagen muestra personas no famosas en situaciones ambiguas o contextos que podrían ser interpretados como sugerentes, pero no son explícitamente ofensivos.
        DESCONOCIDOS_OFENSIVO: La imagen muestra personas no famosas en cualquier situación, ya sea explícita, sugerente o simplemente mostrando su rostro, y se clasifica como ofensiva.
        Para imágenes sin personas:
        SIN_PERSONAS_ADECUADA: La imagen no contiene personas y no presenta ningún contenido inapropiado.
        SIN_PERSONAS_POTENCIALMENTE_SUGERENTE: La imagen no contiene personas, pero tiene elementos que podrían ser interpretados como sugerentes.
        SIN_PERSONAS_OFENSIVA: La imagen no contiene personas, pero presenta contenido ofensivo.
        Especial:
        SELFIE_OFENSIVO: Toda imagen que sea una selfie, independientemente de si la toma una persona famosa o no, se clasifica automáticamente como ofensiva.
        
        {
        "category": "ADECUADA" | "OFENSIVA" | "POTENCIALMENTE_SUGERENTE",
        "subcategory": "OFENSIVO" | "FAMOSOS_ADECUADA" | "FAMOSOS_SUGERENTE" | "FAMOSOS_OFENSIVO" | "DESCONOCIDOS_ADECUADA" | "DESCONOCIDOS_POTENCIALMENTE_SUGERENTE" | "DESCONOCIDOS_OFENSIVO" | "SIN_PERSONAS_ADECUADA" | "SIN_PERSONAS_POTENCIALMENTE_SUGERENTE" | "SIN_PERSONAS_OFENSIVA" | "SELFIE_OFENSIVO",
        "image": "Aquí va la URL de la imagen",
        "reason": "Explicación de por qué la imagen pertenece a la categoría asignada. Que se muestre en catalán."
        }

        Casos específicos:
        Si la imagen contiene el rostro de una persona no famosa:

        {
        "category": "OFENSIVA",
        "subcategory": "DESCONOCIDOS_OFENSIVO",
        "image": "Aquí va la URL de la imagen",
        "reason": "No es possible classificar la imatge perquè conté el rostre d'una persona no famosa."
        }

        Si no se puede clasificar por falta de información:

        {
        "error": "No se pudo clasificar la imagen por [razón del error]",
        "image": "URL de la imagen"
        }
        
        Por mas ofensivo que sea una imagen devuelve por lo menos un mensaje de error.`;

        const promptTokens = encode(prompt).length;

        const result = await generateContentWithRetry(model, prompt, imagePart);

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

app.post("/classify-imageCommunity", async (req, res) => {
    try {
        console.log("estoy dentro");
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

        const result = await generateContentWithRetry(model, prompt, imagePart);

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