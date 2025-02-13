const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const secretKey = process.env.SECRET_KEY;
const refreshKey = process.env.REFRESH_KEY;
const mongoUri = process.env.MONGO_URI;

console.log('Secret key:', secretKey);
console.log('Refresh key:', refreshKey);
console.log('Mongo URI:', mongoUri);

// Conexión a la base de datos
mongoose.connect(mongoUri, { 
    dbName: 'Tokens'
})
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
    console.log('Verify token:', req.headers);

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Token es requerido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        console.log('Decoded:', decoded);
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expirado' });
            }
            console.log('Error al autenticar el token verifyToken:', err);
            return res.status(403).json({ error: 'Fallo al autenticar el token verifyToken'});
        }
        req.user = decoded;
        next();
    });
}

// Lógica para refrescar el token
async function refreshToken(req, res) {
    console.log('Refresh token 0:', req.body);
    const { refreshToken } = req.body;

    console.log('Refresh token 1:', refreshToken);

    if (!refreshToken) return res.status(401).send('Token es requerido');

    try {
        const tokenDoc = await Token.findOne({ token: refreshToken });
        if (!tokenDoc) {
            return res.status(403).json({ error: 'Token inválido' });
        }

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
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
}

async function deleteToken(refreshToken) {
    try {
        await Token.deleteOne({ token: refreshToken });
        console.log('Token eliminado exitosamente');
    } catch (err) {
        console.error('Error al eliminar el token:', err);
    }
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
