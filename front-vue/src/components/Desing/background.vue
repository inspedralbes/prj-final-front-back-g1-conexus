<template>
  <canvas ref="canvasRef" class="absolute top-0 left-0 w-full h-full -z-10"></canvas>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'

const canvasRef = ref(null)
const books = ref([])
const animationFrameId = ref(null)
const NUM_BOOKS = 70

const initBooks = (canvas) => {
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // Paleta de colores institucionales
  const bookColors = [
    'rgba(79, 70, 229, 0.4)',  // indigo
    'rgba(99, 102, 241, 0.4)', 
    'rgba(55, 48, 163, 0.4)',
    'rgba(220, 38, 38, 0.4)',   // rojo
    'rgba(22, 163, 74, 0.4)',   // verde
    'rgba(234, 88, 12, 0.4)',   // naranja
    'rgba(139, 92, 246, 0.4)',  // violeta
    'rgba(20, 184, 166, 0.4)'   // turquesa
  ]
  
  // Títulos académicos
  const bookTitles = [
    'MATH', 'SCI', 'LIT', 'HIST', 'ART', 
    'PHYS', 'CHEM', 'BIO', 'GEO', 'LANG',
    'CALC', 'ALG', 'PHIL', 'ECON', 'EDU',
    'MUS', 'SPAN', 'ENG', 'FREN', 'CODE'
  ]

  books.value = Array.from({ length: NUM_BOOKS }, () => {
    const size = Math.random() * 50 + 20 // Libros entre 20px y 70px
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: size,
      originalSize: size,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      color: bookColors[Math.floor(Math.random() * bookColors.length)],
      title: bookTitles[Math.floor(Math.random() * bookTitles.length)],
      opacity: Math.random(), // Inicia con opacidad aleatoria
      fadeDirection: Math.random() > 0.5 ? 1 : -1, // 1 = apareciendo, -1 = desapareciendo
      fadeSpeed: Math.random() * 0.02 + 0.01, // Velocidad de desvanecimiento única
      hover: false,
      hoverProgress: 0
    }
  })

  animateBooks(canvas)
  
  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas)
    cancelAnimationFrame(animationFrameId.value)
  })
}

const drawBook = (ctx, book) => {
  ctx.save()
  ctx.translate(book.x, book.y)
  ctx.rotate(book.rotation)
  
  // Aplicar efectos combinados (hover + fade)
  const currentSize = book.originalSize * (1 + book.hoverProgress * 0.3)
  const currentOpacity = Math.max(0.1, Math.min(1, book.opacity)) // Limitar entre 0.1 y 1
  
  // Portada del libro con opacidad
  ctx.fillStyle = book.color.replace('0.4', currentOpacity.toFixed(2))
  ctx.strokeStyle = darkenColor(book.color, 30).replace('0.4', (currentOpacity * 0.8).toFixed(2))
  ctx.lineWidth = 1
  
  // Cuerpo del libro
  ctx.beginPath()
  ctx.rect(-currentSize/3, -currentSize/4, currentSize/1.5, currentSize/2)
  ctx.fill()
  ctx.stroke()
  
  // Lomo del libro (3D effect)
  ctx.fillStyle = darkenColor(book.color, 25).replace('0.4', (currentOpacity * 0.9).toFixed(2))
  ctx.beginPath()
  ctx.moveTo(currentSize/3, -currentSize/4)
  ctx.lineTo(currentSize/3 + 5, -currentSize/4 + 6)
  ctx.lineTo(currentSize/3 + 5, currentSize/4 + 6)
  ctx.lineTo(currentSize/3, currentSize/4)
  ctx.closePath()
  ctx.fill()
  
  // Detalle del lomo (líneas)
  ctx.strokeStyle = darkenColor(book.color, 40).replace('0.4', (currentOpacity * 0.7).toFixed(2))
  for(let i = -currentSize/4 + 8; i < currentSize/4; i += 8) {
    ctx.beginPath()
    ctx.moveTo(currentSize/3, i)
    ctx.lineTo(currentSize/3 + 5, i + 6)
    ctx.stroke()
  }
  
  // Título del libro (solo cuando es visible)
  if(currentSize > 30 && currentOpacity > 0.5) {
    ctx.fillStyle = darkenColor(book.color, 60).replace('0.4', (currentOpacity * 0.9).toFixed(2))
    const fontSize = Math.max(10, currentSize/5)
    ctx.font = `bold ${fontSize}px 'Arial', sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Ajustar texto si es muy largo
    const shortTitle = book.title.length > 5 ? 
      book.title.substring(0, 4) + '.' : book.title
    ctx.fillText(shortTitle, 0, 0)
  }
  
  ctx.restore()
}

const darkenColor = (color, percent) => {
  const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  if(!match) return color
  
  const r = Math.max(0, parseInt(match[1]) - percent)
  const g = Math.max(0, parseInt(match[2]) - percent)
  const b = Math.max(0, parseInt(match[3]) - percent)
  const a = parseFloat(match[4])
  
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

const animateBooks = (canvas) => {
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  books.value.forEach((book) => {
    // Movimiento con rebote
    book.x += book.speedX
    book.y += book.speedY
    book.rotation += book.rotationSpeed
    
    // Cambio de dirección ocasional para movimiento más orgánico
    if(Math.random() < 0.003) {
      book.speedX = (Math.random() - 0.5) * 0.8
      book.speedY = (Math.random() - 0.5) * 0.8
    }
    
    // Efecto de desvanecimiento
    book.opacity += book.fadeDirection * book.fadeSpeed
    
    // Cambiar dirección del fade cuando llega a los límites
    if(book.opacity <= 0.1) {
      book.fadeDirection = 1
      book.opacity = 0.1
      // Cambiar posición cuando está casi invisible para efecto de "nuevo libro"
      if(Math.random() < 0.3) {
        book.x = Math.random() * width
        book.y = Math.random() * height
      }
    } else if(book.opacity >= 1) {
      book.fadeDirection = -1
      book.opacity = 1
    }
    
    // Efecto hover aleatorio (opcional)
    book.hover = Math.random() < 0.2
    
    // Suavizar transición hover
    if(book.hover) {
      book.hoverProgress = Math.min(1, book.hoverProgress + 0.04)
    } else {
      book.hoverProgress = Math.max(0, book.hoverProgress - 0.04)
    }

    // Rebotar en los bordes
    if (book.x < -book.size || book.x > width + book.size) book.speedX *= -1
    if (book.y < -book.size || book.y > height + book.size) book.speedY *= -1

    // Solo dibujar si tiene suficiente opacidad
    if(book.opacity > 0.15) {
      drawBook(ctx, book)
    }
  })

  animationFrameId.value = requestAnimationFrame(() => animateBooks(canvas))
}

onMounted(() => {
  if (canvasRef.value) {
    initBooks(canvasRef.value)
  }
})

onUnmounted(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>