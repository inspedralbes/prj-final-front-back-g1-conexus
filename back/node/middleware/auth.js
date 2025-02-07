const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const refreshKey = process.env.REFRESH_KEY;
const refreshTokensDB = new Set(); 

// Lógica para crear los tokens de acceso y refresco
function createTokens(user) {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        secretKey,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        refreshKey,
        { expiresIn: '7d' }
    );

    refreshTokensDB.add(refreshToken);

    console.log('Refresh tokens:', refreshTokensDB.values());

    return { accessToken, refreshToken };
}

// Middleware para verificar el token de acceso
function verifyToken(req, res, next) {
    console.log('bd:', refreshTokensDB.values());

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Token es requerido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expirado' });
            }
            return res.status(403).json({ error: 'Fallo al autenticar el token' });
        }
        req.user = decoded; 
        next();
    });
}

// Lógica para refrescar el token
function refreshToken(req, res) {
    console.log('Refresh token 0:', req.body);
    const { refreshToken } = req.body;

    console.log('Refresh token 1:', refreshToken);

    if (!refreshToken) return res.status(401).send('Token es requerido');
    if (!refreshTokensDB.has(refreshToken)) return res.status(403).send('Token inválido');

    try {
        console.log('Refresh token 2:', refreshToken);
        const decoded = jwt.verify(refreshToken, refreshKey);
        console.log('Decoded:', decoded);

        const newAccessToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            secretKey,
            { expiresIn: '1h' }
        );
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.log('Error al refrescar el token:', err);
        refreshTokensDB.delete(refreshToken);
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
}

// Exportar funciones
module.exports = {
    createTokens,
    verifyToken,
    refreshToken,
    refreshTokensDB,
};
