import { spawn } from 'node:child_process';

// Configuración del entorno
const isDevelopment = process.env.NODE_ENV === 'development';
const executor = isDevelopment ? 'nodemon' : 'node';

console.log(`Ejecutando en modo ${isDevelopment ? 'desarrollo' : 'producción'}`);

// Registro de servicios con sus nombres de archivo
const services = {
    assistences: { state: "stopped", process: null, script: "assistences.js" },
    incidents: { state: "stopped", process: null, script: "incidents.js" },
    grades: { state: "stopped", process: null, script: "grades.js" },
    rooms: { state: "stopped", process: null, script: "rooms.js" },
    lostObjects: { state: "stopped", process: null, script: "lostObjects.js" },
    canteen: { state: "stopped", process: null, script: "canteen.js" },
};

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
            state: services[serviceName].state 
        };
    }
    return null;
};

// Obtener el estado de todos los servicios
export function getAllServicesStatus() {
    const status = {};
    
    for (const [name, service] of Object.entries(services)) {
        status[name] = {
            state: service.state
        };
    }
    
    return status;
};