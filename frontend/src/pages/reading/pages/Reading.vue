<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card flat bordered class="q-pa-sm" style="max-width: 420px; width: 100%">
      <q-toolbar>
        <q-toolbar-title>📡 Detalhes da Leitura</q-toolbar-title>
      </q-toolbar>

      <q-card-section class="column q-gutter-md">
        <div class="row items-center justify-between">
          <div><strong>Número:</strong></div>
          <div>{{ data?.number }}</div>
        </div>

        <q-separator />

        <div class="row items-center justify-between">
          <div><strong>Leitura:</strong></div>
          <div>{{ data?.reading }}</div>
        </div>

        <q-separator />

        <div class="row items-center justify-between">
          <div><strong>Hidrômetro:</strong></div>
          <div>{{ data?.watermeter?.number }}</div>
        </div>

        <q-separator />

        <div class="row items-center justify-between">
          <div><strong>Cliente:</strong></div>
          <div>{{ data?.customer?.fullName }}</div>
        </div>

        <q-separator />

        <div class="row items-center justify-between">
          <div><strong>Tipo de Leitura:</strong></div>
          <div>{{ data?.type?.name }}</div>
        </div>

        <q-separator v-if="data?.type?.name === 'Anomalia'" />

        <div
          v-if="data?.type.name === 'Anomalia'"
          class="row items-center justify-between"
        >
          <div><strong>Anomalia:</strong></div>
          <div>
            {{ data?.anomaly?.name || "N/A" }} ({{ data?.anomaly?.code || "N/A" }})
          </div>
        </div>

        <q-separator />

        <div class="row items-center justify-between">
          <div><strong>Inspeção:</strong></div>
          <div>{{ data?.inspection?.number || "N/A" }}</div>
        </div>

        <q-separator />

        <div class="row items-center justify-between">
          <div><strong>Leitor:</strong></div>
          <div>{{ data?.reader?.displayName }}</div>
        </div>
        <q-separator />
        <img :src="`${data?.fotoUrl}`" class="camera-preview q-mt-sm"   />
      </q-card-section>
    </q-card>
    <q-footer bordered class="bg-grey-2 text-right q-pa-sm">
      <q-btn
        color="primary"
        icon="arrow_back"
        label="Voltar"
        @click="router.push('/readings')"
      />
    </q-footer>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useReadingStore } from "../stores";
import { useRoute, useRouter } from "vue-router";
const API_URL = import.meta.env.VITE_API_URL;

const route = useRoute();
const router = useRouter();

const readingStore = useReadingStore();

const { id } = route.params;
const data = ref();

async function fetchData() {
  try {
    await readingStore.findOne(id);
    data.value = readingStore.reading;

  } catch (error) {}
}
function openImage(url) {
  if (url) {
    window.open(url, "_blank"); // abre em nova aba
  }
}
onMounted(async () => {
  await fetchData();
});
</script>

<style scoped>
/* Estilização para uma aparência limpa e mobile-first */
q-card {
  border-radius: 8px;
}
q-card-section > .row {
  padding: 6px 0;
}
.camera-preview {
  width: 70%;
  border-radius: 4px;
}
</style>
