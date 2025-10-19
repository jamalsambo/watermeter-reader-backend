<template>
  <div class="p-4">
    <h2>📡 Rastreamento de Localização</h2>

    <div v-if="erro" class="text-red-500 mt-2">
      {{ erro }}
    </div>

    <div v-else-if="coordenadas">
      <p>🌍 Latitude: <strong>{{ coordenadas.lat }}</strong></p>
      <p>🌍 Longitude: <strong>{{ coordenadas.lon }}</strong></p>
      <p>🎯 Precisão: <strong>{{ coordenadas.accuracy }} m</strong></p>
      <p v-if="coordenadas.speed !== null">
        🚀 Velocidade: <strong>{{ (coordenadas.speed * 3.6).toFixed(2) }} km/h</strong>
      </p>
    </div>

    <div v-else class="text-gray-500 mt-2">
      Obtendo localização...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const coordenadas = ref(null);
const erro = ref(null);
let watchId = null;

onMounted(() => {
  if (!navigator.geolocation) {
    erro.value = "Geolocalização não é suportada neste navegador.";
    console.error(erro.value);
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      const accuracy = pos.coords.accuracy;
      const speed = pos.coords.speed; // m/s (pode ser null)

      coordenadas.value = { lat, lon, accuracy, speed };

      console.log("📍 Nova posição:");
      console.log(`Latitude: ${lat}`);
      console.log(`Longitude: ${lon}`);
      console.log(`Precisão: ${accuracy} m`);
      if (speed !== null) console.log(`Velocidade: ${(speed * 3.6).toFixed(2)} km/h`);
      console.log("-----------------------------");
    },
    (err) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          erro.value = "Permissão negada pelo usuário.";
          break;
        case err.POSITION_UNAVAILABLE:
          erro.value = "Informações de localização indisponíveis.";
          break;
        case err.TIMEOUT:
          erro.value = "Tempo de solicitação esgotado.";
          break;
        default:
          erro.value = "Erro desconhecido.";
      }
      console.error(erro.value);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000, // cache máximo de 1s
      timeout: 10000,   // tempo máximo de resposta
    }
  );
});

onUnmounted(() => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    console.log("🛑 Rastreamento parado.");
  }
});
</script>

<style scoped>
h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}
p {
  margin: 4px 0;
}
</style>
