<template>
  <div class="p-4">
    <h2>Calcular distância até um ponto fixo</h2>
    <p><strong>Latitude atual:</strong> {{ latitude }}</p>
    <p><strong>Longitude atual:</strong> {{ longitude }}</p>
    <p><strong>Distância até o ponto fixo:</strong> {{ distance.toFixed(2) }} metros</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Coordenada fixa (exemplo: um ponto de referência)
const fixedLat = -25.9655  // exemplo: Maputo
const fixedLon = 32.5832

const latitude = ref(null)
const longitude = ref(null)
const distance = ref(0)

let watchId = null

// Função para calcular distância entre dois pontos (em metros)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3 // raio da Terra em metros
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

onMounted(() => {
  if ('geolocation' in navigator) {
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        latitude.value = lat
        longitude.value = lon
        console.log(`Posição atual: lat=${lat}, lon=${lon}`)

        // Calcular distância entre atual e ponto fixo
        distance.value = calculateDistance(lat, lon, fixedLat, fixedLon)
      },
      (err) => console.error('Erro ao obter localização:', err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    )
  } else {
    console.error('Geolocalização não suportada neste dispositivo.')
  }
})

onBeforeUnmount(() => {
  if (watchId) navigator.geolocation.clearWatch(watchId)
})
</script>
