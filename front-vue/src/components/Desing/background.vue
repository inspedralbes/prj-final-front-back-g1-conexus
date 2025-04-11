<template>
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <canvas ref="canvasRef" class="w-full h-full bg-indigo-950"></canvas>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, onUnmounted } from 'vue'
  
  const canvasRef = ref(null)
  const particles = ref([])
  const animationFrameId = ref(null)
  const NUM_PARTICLES = 80
  
  const initParticles = (canvas) => {
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    particles.value = Array.from({ length: NUM_PARTICLES }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)` // Tonos azules
    }))
  
    animateParticles(canvas)
    
    onUnmounted(() => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId.value)
    })
  }
  
  const animateParticles = (canvas) => {
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
  
    ctx.clearRect(0, 0, width, height)
  
    particles.value.forEach((p, index) => {
      p.x += p.speedX
      p.y += p.speedY
  
      if (p.x < 0 || p.x > width) p.speedX *= -1
      if (p.y < 0 || p.y > height) p.speedY *= -1
  
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
  
      for (let j = index + 1; j < particles.value.length; j++) {
        const p2 = particles.value[j]
        const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2)
  
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `hsla(210, 70%, 60%, ${1 - dist / 120})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    })
  
    animationFrameId.value = requestAnimationFrame(() => animateParticles(canvas))
  }
  
  onMounted(() => {
    if (canvasRef.value) {
      initParticles(canvasRef.value)
    }
  })
  
  onUnmounted(() => {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
    }
  })
  </script>