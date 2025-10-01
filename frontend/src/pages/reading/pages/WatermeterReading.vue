<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-lg q-mx-auto" style="max-width: 900px">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="speed" class="q-mr-sm" />
          Leitura de Hidrômetro
        </div>
        <div class="text-subtitle2 text-grey">Hidrômetro #{{ hydrometer?.number }}</div>
      </q-card-section>

      <q-card-section>
        <!-- Mapa -->
        <div id="map" style="height: 400px" class="q-mb-md"></div>

        <div class="row items-center q-gutter-sm q-mt-md">
          <q-badge outline color="primary"> Distância: {{ distance }} m </q-badge>

          <q-btn
            label="Fazer Leitura"
            icon="check_circle"
            color="positive"
            :disable="distance > 5"
            @click="submitReading"
          />
        </div>
      </q-card-section>
      <q-footer bordered class="bg-grey-2 text-right q-pa-sm">
        <q-btn
          color="primary"
          icon="arrow_back"
          label="Voltar"
          @click="router.push('/')"
        />
      </q-footer>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useWatermeterStore } from "src/pages/watermeter/stores";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const watermeterStore = useWatermeterStore();

// Dados simulados do hidrômetro (normalmente vem de API ou route param)
const { id, inspectionId } = route.params;
const hydrometer = ref();

// Variáveis reativas
const userLocation = ref(null);
const distance = ref(Infinity);
const ready = ref(false);

let map = null;
let routeControl = null;

const time = ref(0); // tempo em segundos

async function initMap() {
  await nextTick();

  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
    dragging: true,
  }).setView([hydrometer.value.lantitude, hydrometer.value.longitude], 17);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Marcador fixo do hidrômetro
  L.marker([hydrometer.value.lantitude, hydrometer.value.longitude])
    .addTo(map)
    .bindPopup("📍 Hidrômetro")
    .openPopup();

  // Controle de rota
  routeControl = L.Routing.control({
    waypoints: [],
    createMarker: () => null,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    show: false,
    lineOptions: {
      styles: [{ color: "#2196f3", opacity: 0.8, weight: 6 }],
    },
  }).addTo(map);

  // Captura a distância e tempo da rota
  routeControl.on("routesfound", function (e) {
    const summary = e.routes[0].summary;
    distance.value = summary.totalDistance; // metros
    time.value = summary.totalTime; // segundos
  });

  // Rastreia localização em tempo real
  navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      userLocation.value = { lat, lon };
      ready.value = true;

      // Atualiza marcador do usuário
      if (!map.userMarker) {
        map.userMarker = L.marker([lat, lon], {
          title: "Você",
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          }),
        }).addTo(map);
      } else {
        map.userMarker.setLatLng([lat, lon]);
      }

      // Atualiza rota
      routeControl.setWaypoints([
        L.latLng(lat, lon),
        L.latLng(hydrometer.value.lantitude, hydrometer.value.longitude),
      ]);
    },
    (err) => console.error("Erro ao obter localização:", err),
    { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
  );
}

// Dispara ao clicar em "Fazer Leitura"
function submitReading() {
  router.push(`/inspections/${inspectionId}/readings/watermeter/${id}/qrcode`);
}

async function fetchData() {
  try {
    await watermeterStore.findOne(id);
    hydrometer.value = watermeterStore.watermeter;
  } catch (error) {
    console.log(error);
  }
}

// Inicializa tudo ao montar o componente
onMounted(async () => {
  await fetchData();
  initMap();
});
</script>

<style scoped>
#map {
  width: 100%;
}
</style>
