<template>
  <div>
    <div id="map" style="height: 400px"></div>
    <p v-if="loadingLocation">Obtendo localização com precisão...</p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps(['lat', 'lng'])
const emit = defineEmits(['update:lat', 'update:lng'])

let map
let marker
let watchId = null

const loadingLocation = ref(true)

function setMarker(lat, lng) {
  if (!marker) {
    marker = L.marker([lat, lng], { draggable: false }).addTo(map)
  } else {
    marker.setLatLng([lat, lng])
  }

  map.setView([lat, lng], 16)

  // 🔥 envia para o componente pai
  emit('update:lat', lat)
  emit('update:lng', lng)
}

function startTrackingLocation() {
  if (!navigator.geolocation) {
    alert('Geolocalização não suportada')
    return
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords

      console.log("Lat:", latitude, "Lng:", longitude, "Accuracy:", accuracy)

      // 🧠 aceita apenas localização mais precisa
      if (accuracy <= 30) {
        setMarker(latitude, longitude)

        // para quando estiver bom
        if (accuracy <= 20) {
          loadingLocation.value = false

          if (watchId) {
            navigator.geolocation.clearWatch(watchId)
          }
        }
      }
    },
    (err) => {
      console.error(err)
      alert('Erro ao obter localização')
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  )
}

onMounted(() => {
  const initialLat = props.lat || -18.9
  const initialLng = props.lng || 35.3

  map = L.map('map').setView([initialLat, initialLng], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  setMarker(initialLat, initialLng)

  // 🚀 inicia automaticamente
  startTrackingLocation()

  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    setMarker(lat, lng)
  })
})

onUnmounted(() => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId)
  }
})
</script>

<style>
#map {
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
