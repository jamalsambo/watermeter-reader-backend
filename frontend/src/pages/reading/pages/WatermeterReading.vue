<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-lg q-mx-auto" style="max-width: 900px">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="speed" class="q-mr-sm" />
          Leitura de Hidrômetro
        </div>
        <div class="text-subtitle2 text-grey">
          Hidrômetro #{{ hydrometer?.number }}
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Mensagem de carregamento -->
        <div v-if="!ready" class="q-pa-md flex flex-center column text-center">
          <q-spinner color="primary" size="40px" class="q-mb-md" />
          <div>Obtendo coordenadas do dispositivo...</div>
        </div>

        <!-- Mapa e botões -->
        <div v-else>
          <div id="map" style="height: 400px" class="q-mb-md"></div>

          <div class="row items-center q-gutter-sm q-mt-md">
            <q-badge outline color="primary">
              Distância: {{ distance }} m
            </q-badge>

            <q-btn
              label="Fazer Leitura"
              icon="check_circle"
              color="positive"
              :disable="distance > 5"
              @click="submitReading"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useWatermeterStore } from "src/pages/watermeter/stores";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const watermeterStore = useWatermeterStore();

const { id, inspectionId } = route.params;

const hydrometer = ref(null);
const latitude = ref(null);
const longitude = ref(null);
const distance = ref(0);
const ready = ref(false);

let map = null;
let watchId = null;
let routeControl = null;

// Função para calcular distância entre dois pontos (em metros)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const submitReading = () => {
  router.push(`/inspections/${inspectionId}/readings/watermeter/${id}/qrcode`);
};

async function fetchData() {
  try {
    await watermeterStore.findOne(id);
    hydrometer.value = watermeterStore.watermeter;
  } catch (error) {
    console.error("Erro ao carregar hidrômetro:", error);
  }
}

async function initMap(lat, lon) {
  await nextTick();

  if (map) {
    map.remove(); // limpa o mapa anterior se existir
  }

  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView([lat, lon], 17);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // marcador do usuário
  const userMarker = L.marker([lat, lon], {
    title: "Sua posição",
    icon: L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }),
  }).addTo(map);

  // marcador do hidrômetro
  const hydroMarker = L.marker([
    hydrometer.value.lantitude,
    hydrometer.value.longitude,
  ])
    .addTo(map)
    .bindPopup("📍 Hidrômetro");

  // rota
  routeControl = L.Routing?.control({
    waypoints: [
      L.latLng(lat, lon),
      L.latLng(hydrometer.value.lantitude, hydrometer.value.longitude),
    ],
    createMarker: () => null,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    show: false,
    lineOptions: {
      styles: [{ color: "#2196f3", opacity: 0.8, weight: 6 }],
    },
  }).addTo(map);
}

onMounted(async () => {
  await fetchData();

  if (!("geolocation" in navigator)) {
    console.error("Geolocalização não suportada neste dispositivo.");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      latitude.value = lat;
      longitude.value = lon;
      ready.value = true;

      // calcula distância
      if (hydrometer.value?.lantitude && hydrometer.value?.longitude) {
        distance.value = calculateDistance(
          lat,
          lon,
          hydrometer.value.lantitude,
          hydrometer.value.longitude
        ).toFixed(2);
      }

      initMap(lat, lon);
    },
    (err) => console.error("Erro ao obter localização:", err),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
});

onBeforeUnmount(() => {
  if (watchId) navigator.geolocation.clearWatch(watchId);
});
</script>

<style scoped>
#map {
  width: 100%;
}
</style>
