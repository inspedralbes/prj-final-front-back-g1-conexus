import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://root:password@conexus-hub-mongodb:27017';

async function testMongoDBConnection() {
    try {
        console.log("Probando conexión a MongoDB...");
        console.log("URL de conexión:", MONGODB_URI);

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        console.log("¡Conexión exitosa a MongoDB!");

        // Probar listado de bases de datos
        console.log("Listando bases de datos disponibles:");
        const adminDb = mongoose.connection.db.admin();
        const result = await adminDb.listDatabases();
        console.log("Bases de datos:", result.databases.map(db => db.name).join(", "));

        // Crear una colección de prueba
        console.log("Creando colección de prueba 'test_collection'...");
        await mongoose.connection.db.createCollection('test_collection');
        console.log("Colección creada con éxito");

        // Insertar un documento de prueba
        console.log("Insertando documento de prueba...");
        const result2 = await mongoose.connection.db.collection('test_collection').insertOne({
            test: true,
            message: "Prueba de conexión exitosa",
            timestamp: new Date()
        });
        console.log("Documento insertado:", result2.insertedId);

        // Cerrar conexión
        // await mongoose.connection.close();
        // console.log("Conexión cerrada");

    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
        if (mongoose.connection) await mongoose.connection.close();
    }
}

// Ejecutar la prueba
testMongoDBConnection(); 