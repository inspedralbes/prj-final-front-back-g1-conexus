const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const refreshKey = process.env.REFRESH_KEY;

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI, { dbName: 'Tokens' })
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

const tokenSchema = new mongoose.Schema({
    token: String,
    date_crated: Date,
});

const Token = mongoose.model('Token', tokenSchema);

// Función para eliminar tokens antiguos
scheduleDailyTokenCleanup();

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

    const newToken = new Token({ token: refreshToken, date_crated: new Date() });
    newToken.save()
        .then(() => console.log('Refresh token guardado en MongoDB'))
        .catch(err => console.error('Error al guardar el refresh token en MongoDB:', err));

    return { accessToken, refreshToken };
}

// Middleware para verificar el token de acceso
function verifyToken(req, res, next) {

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
    Token.findOne({ token: refreshToken }, (err, tokenDoc) => {
        if (err) {
            return res.status(500).json({ error: 'Error al buscar el token en la base de datos' });
        }
        if (!tokenDoc) {
            return res.status(403).json({ error: 'Token inválido' });
        }
    });

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

function deleteToken(refreshToken) {
    Token.deleteOne({ token: refreshToken }, (err) => {
        if (err) {
            console.error('Error al eliminar el token:', err);
        } else {
            console.log('Token eliminado exitosamente');
        }
    });
}

// Refrescar los tokens almacenados en la base de datos
async function deleteOldTokensMongo() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
        const result = await Token.deleteMany({ date_crated: { $lt: sevenDaysAgo } });
        console.log(`Tokens eliminados: ${result.deletedCount}`);
    } catch (err) {
        console.error('Error al eliminar tokens antiguos:', err);
    }
}

// Ejecutar la función deleteOldTokensMongo una vez al día
function scheduleDailyTokenCleanup() {
    const now = new Date();
    const millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) - now;

    setTimeout(function () {
        deleteOldTokensMongo();
        setInterval(deleteOldTokensMongo, 24 * 60 * 60 * 1000);
    }, millisTillMidnight);
}

// Exportar funciones
module.exports = {
    createTokens,
    verifyToken,
    refreshToken,
    deleteToken
};
