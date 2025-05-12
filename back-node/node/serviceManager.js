import { spawn } from 'node:child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pidusage from 'pidusage'; // Necesitarás instalar este paquete: npm install pidusage

// Configuración del entorno
const isDevelopment = process.env.NODE_ENV === 'development';
const executor = isDevelopment ? 'nodemon' : 'node';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`Ejecutando en modo ${isDevelopment ? 'desarrollo' : 'producción'}`);

// Discover service files dynamically (exclude certain files)
const excludedFiles = ['index.js', 'serviceManager.js', 'token.js', 'Dockerfile', 'prod.Dockerfile'];
const services = {};

// Read directory and identify service files
fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.js') && !excludedFiles.includes(file))
    .forEach(file => {
        const serviceName = path.basename(file, '.js');
        services[serviceName] = { 
            state: "stopped", 
            process: null, 
            script: file,
            usage: 0,
            description: getServiceDescription(serviceName)
        };
    });

// Helper function to get service description
function getServiceDescription(serviceName) {
    const serviceDescriptions = {
        'assistences': { name: 'Servei d\'Assistència', tech: 'Node.js 18.x' },
        'incidents': { name: 'Gestor d\'Incidències', tech: 'Node.js 18.x' },
        'grades': { name: 'Sistema de Notes', tech: 'Node.js 18.x' },
        'rooms': { name: 'Gestió d\'Aules', tech: 'Node.js 18.x' },
        'lostObjects': { name: 'Objectes Perduts', tech: 'Node.js 18.x' },
        'canteen': { name: 'Servei de Menjador', tech: 'Node.js 18.x' }
    };
    
    return serviceDescriptions[serviceName] || { name: `Servei ${serviceName}`, tech: 'Node.js 18.x' };
}

// Function to update service resource usage (mock values for demonstration)
async function updateServiceUsage() {
    for (const [name, service] of Object.entries(services)) {
        if (service.state === "running" && service.process && service.process.pid) {
            try {
                // Obtener estadísticas reales del proceso
                const stats = await pidusage(service.process.pid);
                
                // Actualizar el uso de la CPU (como porcentaje)
                service.usage = Math.round(stats.cpu);
                
                // Guardar estadísticas detalladas
                service.stats = {
                    memory: Math.round(stats.memory / 1024 / 1024), // MB
                    cpu: Math.round(stats.cpu),
                    elapsed: stats.elapsed,
                    timestamp: Date.now()
                };
            } catch (error) {
                console.error(`Error obteniendo estadísticas para ${name}:`, error);
                service.usage = 0;
                service.stats = null;
                
                // Verificar si el proceso sigue en ejecución
                if (service.process) {
                    try {
                        process.kill(service.process.pid, 0); // Solo verificar, no matar
                    } catch (e) {
                        // El proceso ya no se está ejecutando
                        service.state = "stopped";
                        service.process = null;
                    }
                }
            }
        } else {
            service.usage = 0;
            service.stats = null;
        }
    }
}

// Update resource usage every 5 seconds
setInterval(updateServiceUsage, 5000);

// Iniciar un servicio específico
export function startService(serviceName) {
    const service = services[serviceName];
    
    if (!service) {
        return { success: false, message: `Servicio ${serviceName} no encontrado` };
    }
    
    if (service.state === "running") {
        return { success: true, message: `Servicio ${serviceName} ya está ejecutándose` };
    }
    
    try {
        console.log(`Iniciando servicio ${serviceName} con ${executor}...`);
        const process = spawn(executor, [service.script, '-L']);
        
        service.process = process;
        service.state = "running";
        
        process.stdout.on('data', data => {
            console.log(`[${serviceName}] ${data.toString().trim()}`);
        });
        
        process.stderr.on('data', data => {
            console.error(`[${serviceName} ERROR] ${data.toString().trim()}`);
        });
        
        process.on('close', code => {
            // Si estamos en modo desarrollo y el código es 0 (salida limpia), 
            // probablemente nodemon esté reiniciando, así que no cambiamos el estado
            if (!(isDevelopment && code === 0)) {
                console.log(`Servicio ${serviceName} cerrado con código ${code}`);
                service.state = 'stopped';
                service.process = null;
            }
        });
        
        return { success: true, message: `Servicio ${serviceName} iniciado correctamente con ${executor}` };
    } catch (error) {
        console.error(`Error al iniciar ${serviceName}:`, error);
        return { success: false, message: `Error al iniciar servicio ${serviceName}` };
    }
};

// Detener un servicio específico
export function stopService(serviceName) {
    const service = services[serviceName];
    
    if (!service) {
        return { success: false, message: `Servicio ${serviceName} no encontrado` };
    }
    
    if (service.state === "stopped") {
        return { success: true, message: `Servicio ${serviceName} ya está detenido` };
    }
    
    try {
        console.log(`Deteniendo servicio ${serviceName}...`);
        service.process.kill();
        service.process = null;
        service.state = "stopped";
        service.usage = 0;
        return { success: true, message: `Servicio ${serviceName} detenido correctamente` };
    } catch (error) {
        console.error(`Error al detener ${serviceName}:`, error);
        return { success: false, message: `Error al detener servicio ${serviceName}` };
    }
};

// Iniciar todos los servicios
export function startAllServices() {
    const results = {};
    
    for (const serviceName of Object.keys(services)) {
        results[serviceName] = startService(serviceName);
    }
    
    return results;
};

// Detener todos los servicios
export function stopAllServices() {
    const results = {};
    
    for (const serviceName of Object.keys(services)) {
        if (services[serviceName].state === "running") {
            results[serviceName] = stopService(serviceName);
        }
    }
    
    return results;
};

// Obtener el estado de un servicio específico
export function getServiceStatus(serviceName) {
    if (serviceName && services[serviceName]) {
        return { 
            name: serviceName, 
            displayName: services[serviceName].description.name,
            tech: services[serviceName].description.tech,
            state: services[serviceName].state,
            usage: services[serviceName].usage,
            stats: services[serviceName].stats,
            port: services[serviceName].port
        };
    }
    return null;
};

// Obtener el estado de todos los servicios
export function getAllServicesStatus() {
    const status = {};
    
    for (const [name, service] of Object.entries(services)) {
        status[name] = {
            displayName: service.description.name,
            tech: service.description.tech,
            state: service.state,
            usage: service.usage,
            stats: service.stats,
            port: service.port
        };
    }
    
    return status;
};

// Añadir un nuevo servicio
export function addService(serviceName, scriptName, description = {}) {
    if (services[serviceName]) {
        return { success: false, message: `El servicio ${serviceName} ya existe` };
    }
    
    try {
        const scriptPath = path.join(__dirname, scriptName);
        
        // Si el script no existe, crear uno básico
        if (!fs.existsSync(scriptPath)) {
            const port = description.port || Math.floor(3100 + Math.random() * 900);
            const basicScript = `
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || ${port};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    service: '${serviceName}',
    status: 'running',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta para monitoreo
app.get('/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'ok',
    pid: process.pid,
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
    },
    uptime: process.uptime()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(\`Servicio ${serviceName} ejecutándose en el puerto \${PORT}\`);
});
`;
            fs.writeFileSync(scriptPath, basicScript, 'utf8');
        }
        
        // Registrar el servicio
        services[serviceName] = {
            state: "stopped",
            process: null,
            script: scriptName,
            usage: 0,
            stats: null,
            port: description.port,
            description: {
                name: description.name || `Servei ${serviceName}`,
                tech: description.tech || 'Node.js 18.x'
            }
        };
        
        console.log(`Servicio ${serviceName} creado correctamente`);
        return { success: true, message: `Servicio ${serviceName} creado correctamente` };
    } catch (error) {
        console.error(`Error al crear servicio ${serviceName}:`, error);
        return { success: false, message: `Error al crear servicio: ${error.message}` };
    }
}