<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-toolbar class="bg-grey-2">
        <q-toolbar-title>
          <q-icon name="list" class="q-mr-sm" />
          Hidrômetros - Inspeção {{ rawData?.number }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section class="q-gutter-md">
        <q-list bordered separator v-if="rawData?.hasWatermeters">
          <q-item v-for="h in rawData.hasWatermeters" :key="h.id">
            <q-item-section avatar>
              <q-icon name="water" />
            </q-item-section>

            <q-item-section>
              <div class="text-bold">Hidrômetro: {{ h.watermeter.number }}</div>
              <div class="text-caption text-grey">
                Status: {{ h.inspection ? "Feito":"Pendente" }} | Zona: {{ h.watermeter.zone?.name || "N/A" }}
              </div>
            </q-item-section>

            <q-item-section side v-if="auth.user.userType === 'Leitor'">
              <q-btn
                color="primary"
                icon="water_drop"
                @click="goToReading(h.watermeter.id)"
                dense
                v-if="!h.inspection"
              />
              <q-btn
                color="green"
                icon="visibility"
                @click="router.push(`/readings/${h.watermeter.reading.id}`)"
                dense
                v-else
              />
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="text-grey text-italic q-ml-md q-mt-sm">
          Nenhum hidrômetro atribuído.
        </div>
      </q-card-section>
    </q-card>
    <q-footer bordered class="bg-grey-2 text-right q-pa-sm">
      <q-btn color="primary" icon="arrow_back" label="Voltar" @click="router.back()" />
    </q-footer>
  </q-page>
</template>

<script setup>
import { ref,  onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInspectionStore } from "../stores";
import { useAuthStore } from "src/pages/auth/store";


const router = useRouter();
const route = useRoute();

const auth = useAuthStore();
const inspectionStore = useInspectionStore();

// Simulação com dados reais do backend
const { id } = route.params;
const rawData = ref();

function goToReading(h) {
  router.push(`/inspections/${id}/readings/watermeter/${h}`);
}

async function fetchData() {
  try {
    if (auth.user.userType === "Leitor") {
      await inspectionStore.findOne(id, { employeeId: auth.user.employeeId });
    } else {
      await inspectionStore.findOne(id);
    }
    rawData.value = inspectionStore.inspection;
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await fetchData();
});
</script>
