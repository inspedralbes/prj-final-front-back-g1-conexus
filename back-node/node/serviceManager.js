import { spawn } from 'node:child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pidusage from 'pidusage';

const isDevelopment = process.env.NODE_ENV === 'development';
const executor = isDevelopment ? 'nodemon' : 'node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`Executant en mode ${isDevelopment ? 'desenvolupament' : 'producció'}`);

const excludedFiles = ['index.js', 'serviceManager.js', 'token.js', 'Dockerfile', 'prod.Dockerfile'];
const services = {};

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

function getServiceDescription(serviceName) {
    const serviceDescriptions = {
        'assistences': { name: 'Servei d\'Assistència', tech: 'Node.js 18.x' },
        'incidents': { name: 'Gestor d\'Incidències', tech: 'Node.js 18.x' },
        'grades': { name: 'Sistema de Notes', tech: 'Node.js 18.x' },
        'rooms': { name: 'Gestió d\'Aules', tech: 'Node.js 18.x' },
        'lostObjects': { name: 'Objectes Perduts', tech: 'Node.js 18.x' },
        'canteen': { name: 'Servei de Menjador', tech: 'Node.js 18.x' },
        'chat': { name: 'Xat', tech: 'Node.js 18.x' },
    };
    
    return serviceDescriptions[serviceName] || { name: `Servei ${serviceName}`, tech: 'Node.js 18.x' };
}

async function updateServiceUsage() {
    for (const [name, service] of Object.entries(services)) {
        if (service.state === "running" && service.process && service.process.pid) {
            try {
                const stats = await pidusage(service.process.pid);
                
                service.usage = Math.round(stats.cpu);
                
                service.stats = {
                    memory: Math.round(stats.memory / 1024 / 1024),
                    cpu: Math.round(stats.cpu),
                    elapsed: stats.elapsed,
                    timestamp: Date.now()
                };
            } catch (error) {
                console.error(`Error obtenint estadístiques per ${name}:`, error);
                service.usage = 0;
                service.stats = null;
                
                if (service.process) {
                    try {
                        process.kill(service.process.pid, 0);
                    } catch (e) {
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

setInterval(updateServiceUsage, 5000);

export function startService(serviceName) {
    const service = services[serviceName];
    
    if (!service) {
        return { success: false, message: `Servei ${serviceName} no trobat` };
    }
    
    if (service.state === "running") {
        return { success: true, message: `Servei ${serviceName} ja s'està executant` };
    }
    
    try {
        console.log(`Iniciant servei ${serviceName} amb ${executor}...`);
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
            if (!(isDevelopment && code === 0)) {
                console.log(`Servei ${serviceName} tancat amb codi ${code}`);
                service.state = 'stopped';
                service.process = null;
            }
        });
        
        return { success: true, message: `Servei ${serviceName} iniciat correctament amb ${executor}` };
    } catch (error) {
        console.error(`Error en iniciar ${serviceName}:`, error);
        return { success: false, message: `Error en iniciar servei ${serviceName}` };
    }
};

export function stopService(serviceName) {
    const service = services[serviceName];
    
    if (!service) {
        return { success: false, message: `Servei ${serviceName} no trobat` };
    }
    
    if (service.state === "stopped") {
        return { success: true, message: `Servei ${serviceName} ja està aturat` };
    }
    
    try {
        console.log(`Aturant servei ${serviceName}...`);
        service.process.kill();
        service.process = null;
        service.state = "stopped";
        service.usage = 0;
        return { success: true, message: `Servei ${serviceName} aturat correctament` };
    } catch (error) {
        console.error(`Error en aturar ${serviceName}:`, error);
        return { success: false, message: `Error en aturar servei ${serviceName}` };
    }
};

export function startAllServices() {
    const results = {};
    
    for (const serviceName of Object.keys(services)) {
        results[serviceName] = startService(serviceName);
    }
    
    return results;
};

export function stopAllServices() {
    const results = {};
    
    for (const serviceName of Object.keys(services)) {
        if (services[serviceName].state === "running") {
            results[serviceName] = stopService(serviceName);
        }
    }
    
    return results;
};

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

export function addService(serviceName, scriptName, description = {}) {
    if (services[serviceName]) {
        return { success: false, message: `El servei ${serviceName} ja existeix` };
    }
    
    try {
        const scriptPath = path.join(__dirname, scriptName);
        
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

app.get('/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'ok',
    pid: process.pid,
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    },
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(\`Servei ${serviceName} executant-se al port \${PORT}\`);
});
`;
            fs.writeFileSync(scriptPath, basicScript, 'utf8');
        }
        
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
        
        console.log(`Servei ${serviceName} creat correctament`);
        return { success: true, message: `Servei ${serviceName} creat correctament` };
    } catch (error) {
        console.error(`Error en crear servei ${serviceName}:`, error);
        return { success: false, message: `Error en crear servei: ${error.message}` };
    }
}

export function deleteService(serviceName) {
    const service = services[serviceName];
    
    if (!service) {
        return { success: false, message: `Servei ${serviceName} no trobat` };
    }
    
    try {
        if (service.state === "running") {
            stopService(serviceName);
        }
        
        const scriptPath = path.join(__dirname, service.script);
        if (fs.existsSync(scriptPath)) {
            fs.unlinkSync(scriptPath);
        }
        
        delete services[serviceName];
        
        console.log(`Servei ${serviceName} eliminat correctament`);
        return { success: true, message: `Servei ${serviceName} eliminat correctament` };
    } catch (error) {
        console.error(`Error en eliminar servei ${serviceName}:`, error);
        return { success: false, message: `Error en eliminar servei: ${error.message}` };
    }
}