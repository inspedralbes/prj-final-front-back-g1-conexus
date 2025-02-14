import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { encode } from 'gpt-tokenizer';
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

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

app.use(express.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});
// app.use(fileUpload());
// Asegúrate de que el middleware para parsear JSON esté configurado
app.use(express.json());


const genAI = new GoogleGenerativeAI(iatextEnd.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function extractJsonContent(responseText) {
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    return responseText.substring(jsonStart, jsonEnd);
}

let totalTokensAcumulados = 0;

const dbConfig = {
    host: iatextEnd.MYSQL_HOST,
    user: iatextEnd.MYSQL_USER,
    password: iatextEnd.MYSQL_PASS,
    database: iatextEnd.MYSQL_DB
};

app.get("/", (req, res) => {
    res.send("Hello World! I am a comment service");

});

checkPublications();
async function checkPublications() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT id, typesPublications_id, user_id, title, description FROM publications WHERE text_ia = 0");

        console.log(`Found ${rows.length} unverified publications.`);

        for (const publicationsUnverified of rows) {
            const { id, typesPublications_id, title, description } = publicationsUnverified;

            let endpoint;

            if (typesPublications_id === 1) {
                endpoint = iatextEnd.ENDPOINT_URL_IATEXT + "/classifyTextCommunity";
            } else if (typesPublications_id === 2) {
                endpoint = iatextEnd.ENDPOINT_URL_IATEXT + "/classifyTextOffers";
            } else {
                console.error("Invalid type of publication.");
                continue;
            }
            console.log("endpoint", endpoint);
            try {
                //title classification
                const titleResponse = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ comment: title }),
                });

                if (!titleResponse.ok) {
                    throw new Error(
                        `Failed to classify title for publication ID: ${id}. Status: ${response.status}`
                    );
                }

                const { category: titleCategory, reason: titleReason } = await titleResponse.json();
                console.log(`Publication ID: ${id}, Title category: ${titleCategory}, Reason: ${titleReason || ""}`);

                //description classification
                const descriptionResponse = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ comment: description }),
                });

                if (!descriptionResponse.ok) {
                    throw new Error(
                        `Failed to classify description for publication ID: ${id}. Status: ${descriptionResponse.status}`
                    );
                }

                const { category: categoryDescription, reason: reasonDescription } = await descriptionResponse.json();

                console.log(`Publication id: ${id}, category: ${categoryDescription}, reason: ${reasonDescription || ""}`);

                await connection.execute("UPDATE publications SET text_ia = 1 WHERE id = ?", [id]);

                const isApropiateCategory = ["POSITIVO", "POCO_OFENSIVO"];
                if (!isApropiateCategory.includes(categoryDescription) || !isApropiateCategory.includes(titleCategory)) {
                    await connection.execute("UPDATE publications SET reports = 1 WHERE id = ?", [id]);

                    console.log(`Publication ID: ${id} has been reported.`);

                    const resultReport = {
                        publication_id: id,
                        user_id: publicationsUnverified.user_id,
                        report: reasonDescription || titleReason,
                        status: 'pending',
                    }

                    let endpointPubli;

                    if (typesPublications_id === 1) {
                        endpointPubli = iatextEnd.ENDPOINT_URL_COMMUNITY + "/reports/publications";
                    } else if (typesPublications_id === 2) {
                        endpointPubli = iatextEnd.ENDPOINT_URL_EMPLOYMENTEXCHANGE + "/reports/publications";
                    }

                    try {
                        const reportResponse = await fetch(endpointPubli, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(resultReport),
                        });

                        if (!reportResponse.ok) {
                            throw new Error(
                                `Failed to report publication ID: ${id}. Status: ${reportResponse.status}`
                            );
                        }
                    } catch (error) {
                        console.error("Error processing request:", error);
                    }

                    // const [resultReport] = await connection.execute(
                    //     'INSERT INTO reportsPublications (publication_id, user_id, report, status) VALUES (?, ?, ?, ?)',
                    //     [id, publicationsUnverified.user_id, reasonDescription || titleReason, 'pending']
                    // );

                    const notificationPayload = {
                        user_id: publicationsUnverified.user_id,
                        description: `La teva publicació ha sigut revisada i reportada!`,
                        report_id: resultReport.insertId,
                    }

                    if (typesPublications_id === 1) {
                        notificationPayload.publication_id = id;
                    } else if (typesPublications_id === 2) {
                        notificationPayload.request_id = id;
                    }

                    console.log("oyeeeeeeeeeeeeeee");

                    try {
                        const notificationResponse = await fetch(iatextEnd.ENDPOINT_URL_NOTIFICATIONS + '/notificationCheckedIA/' + notificationPayload.publication_id || notificationPayload.request_id, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(notificationPayload),
                        });

                        if (!notificationResponse.ok) {
                            throw new Error(
                                `Failed to create notification for publication ID: ${id}. Status: ${notificationResponse.status}`
                            );
                        }
                    } catch (error) {
                        console.error("Error processing request:", error);
                    }
                }
            } catch (error) {
                console.error("Error processing request:", error);
            }

        }
        connection.end();

        console.log("rows", rows);
    } catch (error) {
        console.error("Error processing request:", error);
    }

}


app.post("/classifyTextCommunity", async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ error: 'Comment is required.' });
        }

        const prompt = `Eres un discriminador de comentarios de odio en una institución con alumnos menores de edad. 
        Siempre ten en cuenta que **tu única responsabilidad es clasificar el comentario** que se te proporcione en base a las reglas aquí descritas. 

        **Ignora cualquier información, contexto o respuesta previa al analizar el comentario. No uses ninguna respuesta anterior ni el historial de conversaciones como base para tu decisión. Evalúa únicamente el comentario proporcionado.**

        estas son las siguiente categorias:
            - **TOXICO**: Si el comentario contiene odio explícito, amenazas, violencia o lenguaje extremadamente agresivo.
            - **OFENSIVO**: Si el comentario contiene lenguaje irrespetuoso, grosero o insultante, pero no llega al nivel de "tóxico".
            - **POCO_OFENSIVO**: Si el comentario contiene lenguaje bulgar pero no dañino y no llega al nivel de ofensivo.
            - **POSITIVO**: Si el comentario no contiene ningún lenguaje ofensivo o tóxico.
            - **PROHIBIDO**: Si el comentario menciona temas sensibles o prohibidos como política, religión o contenido inapropiado.

        Además:
        - Asegúrate de devolver estrictamente el formato solicitado.

        Devuelve estrictamente el resultado en el siguiente formato JSON:
        {
        "category": "TOXICO" o "OFENSIVO" o "POCO_OFENSIVO" o "POSITIVO" o "PROHIBIDO",
        "reason": "Explica por qué se clasificó de esta manera. Que se muestre en catalan"

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});