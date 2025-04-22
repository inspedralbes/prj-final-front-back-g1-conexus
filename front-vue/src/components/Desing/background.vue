<script setup>
import { onMounted, ref } from "vue";

const canvasRef = ref(null);
const particles = ref([]);
const NUM_PARTICLES = 100; // Cantidad de partículas en el fondo

// Inicializar partículas del fondo
const initParticles = (canvas) => {
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    particles.value = Array.from({ length: NUM_PARTICLES }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
    }));

    animateParticles(ctx, width, height);
};

// Animar partículas
const animateParticles = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);

    // Animación de las partículas originales
    particles.value.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Rebotar en los bordes
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Dibujar líneas entre partículas cercanas
        for (let j = index + 1; j < particles.value.length; j++) {
            const p2 = particles.value[j];
            const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);

            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 100})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(() => animateParticles(ctx, width, height));
};

onMounted(() => {
    const canvas = canvasRef.value;
    if (canvas) {
        initParticles(canvas);
    }
});
</script>

<template>
    <canvas ref="canvasRef" class="absolute top-0 left-0 w-full h-full -z-10"></canvas>
</template>

<style scoped>
canvas {
    position: fixed;
    background: #0f172a; /* Fondo oscuro */
}
</style>