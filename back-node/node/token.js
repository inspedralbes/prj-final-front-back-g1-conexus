import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.NODE_SECRET_KEY_TOKEN;

export function generateToken(email) {
    const payload = { email };
    const secret = SECRET_KEY;
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return token;
}

export function verifyToken(token) {
    const extractedToken = token?.split(' ')[1];
    if (!extractedToken) {
        return { message: "Es requereix un token", login: false, user: null, status: 401 };
    }

    try {
        const decoded = jwt.verify(extractedToken, SECRET_KEY);
        return { message: "Token vàlid", login: false, user: decoded, status: 200 };
    } catch (err) {
        console.log(err);
        if (err.name === "TokenExpiredError") {
            return { message: "El token ha expirat. Inicieu sessió de nou.", login: true, user: null, status: 401 };
        }
        return { message: "Token invàlid", login: false, user: null, status: 401 };
    }
}

export function verifyTokenMiddleware(req, res, next) {
    const verificacio = verifyToken(req.headers.authorization);

    if (verificacio.status === 401) {
        console.log('Token invàlid o expirat.');
        return res.status(401).json(verificacio);
    }

    next();
}