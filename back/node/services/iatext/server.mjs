import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { encode } from 'gpt-tokenizer';
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv(envPath) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        throw result.error;
    }
    return result.parsed;
}

const iatextEnd = loadEnv(path.resolve(__dirname, './.env'));

const app = express();
const port = iatextEnd.PORT;

app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

app.use(fileUpload());
// Asegúrate de que el middleware para parsear JSON esté configurado

const genAI = new GoogleGenerativeAI(iatextEnd.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function extractJsonContent(responseText) {
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    return responseText.substring(jsonStart, jsonEnd);
}

let totalTokensAcumulados = 0;

function checkPublications() {


}

app.get("/", (req, res) => {
    res.send("Hello World! I am a comment service");
});

app.post("/classifyTextCommunity", async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ error: 'Comment is required.' });
        }

        const prompt = `
        Eres un discriminador de comentarios de odio en una institución con alumnos menores de edad. 
        Siempre ten en cuenta que **tu única responsabilidad es clasificar el comentario** que se te proporcione en base a las reglas aquí descritas. 

        **Ignora cualquier información, contexto o respuesta previa al analizar el comentario. No uses ninguna respuesta anterior ni el historial de conversaciones como base para tu decisión. Evalúa únicamente el comentario proporcionado.**

        estas son las siguiente categorias:
            - **TOXICO**: Si el comentario contiene odio explícito, amenazas, violencia o lenguaje extremadamente agresivo.
            - **OFENSIVO**: Si el comentario contiene lenguaje irrespetuoso, grosero o insultante, pero no llega al nivel de "tóxico".
            - **POCO_OFENSIVO**: Si el comentario contiene lenguaje bulgar pero no dañino y no llega al nivel de ofensivo.
            - **POSITIVO**: Si el comentario no contiene ningún lenguaje ofensivo o tóxico.
            - **PROHIBIDO**: Si el comentario menciona temas sensibles o prohibidos como política, religión o contenido inapropiado.

        Además:
        - No incluyas el campo "reason" si la categoría es **POSITIVO**.
        - Asegúrate de devolver estrictamente el formato solicitado.

        Devuelve estrictamente el resultado en el siguiente formato JSON:
        {
        "category": "TOXICO" o "OFENSIVO" o "POCO_OFENSIVO" o "POSITIVO" o "PROHIBIDO",
        "reason": "Explica por qué se clasificó de esta manera. Que se muestre en catalan" (solo si aplica)
        }

        Algunos ejemplos a tener en cuenta:

        **Odio explícito, amenazas, violencia o lenguaje extremadamente agresivo, es TOXICO.**
        **Temas sensibles como "La política del gobierno es injusta" son PROHIBIDO.**
        **Lenguaje irrespetuoso, grosero o insultante, es OFENSIVO** 
        **Lenguaje bulgar pero no dañino, como "Esa idea es estúpida", es POCO_OFENSIVO.**
        **Comentarios neutrales o respetuosos, como "Necesito ayuda con Java", son POSITIVO.**`;

        const promptTokens = encode(prompt).length;

        const result = await model.generateContent([prompt, comment]);
        const responseText = await result.response.text();

        const responseTokens = encode(responseText).length;
        const totalTokens = promptTokens + responseTokens;

        // Assuming totalTokensAcumulados is defined somewhere globally
        totalTokensAcumulados += totalTokens;

        const jsonResponse = extractJsonContent(responseText);
        console.log("comment", req.body.comment);
        res.json(JSON.parse(jsonResponse));

        console.log("Clasificación comments:");
        console.log(jsonResponse);

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.post("/classifyTextOffers", async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ error: 'Comment is required.' });
        }

        const prompt = `
        Eres un discriminador de comentarios en un entorno académico con alumnos menores de edad. Tu tarea es clasificar cada comentario considerando su contenido, intención y contexto. El objetivo es fomentar un ambiente de aprendizaje respetuoso, centrado en la colaboración y el apoyo académico.

        Evalúa los comentarios únicamente basándote en las siguientes categorías:

        Categorías:
        TOXICO - Comentarios que contienen odio explícito, amenazas, violencia o intenciones claras de causar daño emocional o físico.
        OFENSIVO - Comentarios con lenguaje irrespetuoso, grosero o insultante, aunque no lleguen a ser tóxicos.
        POCO_OFENSIVO - Comentarios con lenguaje vulgar o inapropiado, aunque sin intención explícita de herir, pero que no cumplen con los estándares del entorno educativo.
        POSITIVO - Comentarios respetuosos, constructivos o que muestren una clara intención de colaborar, ofrecer ayuda académica o solicitarla de forma adecuada.
        PROHIBIDO - Comentarios que mencionan temas ajenos al ámbito académico, como relaciones personales, política, religión o contenido inapropiado.

        Consideraciones:
        Evalúa tanto la forma como la intención del comentario. Un lenguaje adecuado pero con intención inapropiada también debe ser clasificado correctamente.
        Los comentarios POSITIVO deben fomentar la colaboración académica, ya sea ofreciendo o solicitando ayuda de manera respetuosa.
        En caso de duda razonable sobre la intención, clasifica de forma más restrictiva para proteger el entorno educativo.
        Formato de respuesta:
        Devuelve estrictamente el siguiente formato JSON:

        {
        "category": "TOXICO" o "OFENSIVO" o "POCO_OFENSIVO" o "POSITIVO" o "PROHIBIDO",
        "reason": "Explicació en català" (solo si aplica)
        }
        Clasifica los comentarios con precisión para garantizar que el entorno sea exclusivamente académico y fomente el aprendizaje colaborativo.`;

        const promptTokens = encode(prompt).length;

        const result = await model.generateContent([prompt, comment]);
        const responseText = await result.response.text();

        const responseTokens = encode(responseText).length;
        const totalTokens = promptTokens + responseTokens;

        // Assuming totalTokensAcumulados is defined somewhere globally
        totalTokensAcumulados += totalTokens;

        const jsonResponse = extractJsonContent(responseText);
        console.log("comment", req.body.comment);
        res.json(JSON.parse(jsonResponse));

        console.log("Clasificación comments:");
        console.log(jsonResponse);

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});