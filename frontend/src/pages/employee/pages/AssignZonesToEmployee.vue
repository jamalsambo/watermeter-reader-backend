<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-lg q-mx-auto" style="max-width: 800px">
      <q-card-section>
        <div class="flex items-center">
          <q-icon name="supervisor_account" class="q-mr-sm" size="sm" />
          <span class="text-subtitle1 text-md-h6 text-lg-h5">
            Alocar Zonas ao Funcionário
          </span>
        </div>
      </q-card-section>

      <q-form @submit.prevent="assignZones" class="q-gutter-md">
        <q-select
          v-model="form.zoneIds"
          label="Zonas de Trabalho"
          filled
          multiple
          :options="availableZones"
          option-label="name"
          option-value="id"
          map-options
          use-chips
          emit-value
          :rules="[(val) => val.length > 0 || 'Selecione pelo menos uma zona']"
        />

        <div class="row justify-end q-gutter-sm">
          <q-btn label="Alocar" type="submit" color="primary" />
        </div>
      </q-form>

      <q-separator class="q-my-md" />

      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">
          <q-icon name="map" class="q-mr-sm" />
          Zonas alocadas
        </div>

        <q-list bordered separator v-if="assignedZones.length">
          <q-item v-for="zone in assignedZones" :key="zone.id">
            <q-item-section>{{ zone.name }}</q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click.stop="removeZones(zone.id)"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-grey text-italic q-mt-sm">
          Nenhuma zona alocada ainda.
        </div>
      </q-card-section>
      <q-footer bordered class="bg-grey-2 text-right q-pa-sm">
        <q-btn
          color="primary"
          icon="arrow_back"
          label="Voltar"
          @click="router.back('/')"
        />
      </q-footer>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useComposablesStores } from "app/composables";
import { useEmployeeStore } from "../stores";
import { useAuthStore } from "src/pages/auth/store";

const router = useRouter();
const route = useRoute();

const composablesStores = useComposablesStores();
const employeeStore = useEmployeeStore();
const auth = useAuthStore();

const allZones = ref([]);

const assignedZones = ref([]);
const availableZones = ref([]);
const employee = ref();

const form = ref({
  employeeId: route.params.id,
  zoneIds: [],
});

async function loadAssignedZones() {
  await employeeStore.findOne(route.params.id);
  employee.value = employeeStore.empployee;

  assignedZones.value = employee.value.zones;

  // Exibir somente zonas ainda não atribuídas
  const assignedIds = assignedZones.value.map((z) => z.id);
  availableZones.value = allZones.value.filter(
    (z) => !assignedIds.includes(z.id)
  );

  form.value.zoneIds = [];
}

async function assignZones() {
  try {
    const payload = {
      employeeId: form.value.employeeId,
      zoneIds: form.value.zoneIds,
      createdBy: auth.user.sub,
    };
    await employeeStore.addZones(payload);
    // Simulação: adicionar no assignedZones localmente
    const novas = allZones.value.filter((z) =>
      form.value.zoneIds.includes(z.id)
    );
    assignedZones.value = [...assignedZones.value, ...novas];

    // Limpa zonas disponíveis
    availableZones.value = availableZones.value.filter(
      (z) => !form.value.zoneIds.includes(z.id)
    );
    form.value.zoneIds = [];
  } catch (error) {
    console.log(error);
  }
}

async function removeZones(zone) {
  try {
    await employeeStore.removeZones(route.params.id, zone);
     this.assignedZones = this.assignedZones.filter(z => z.id !== zone);
  } catch (error) {
    console.log(error);
  }
}

async function fetchData() {
  try {
    await composablesStores.findZones();
    allZones.value = composablesStores.zones;
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await fetchData();
  loadAssignedZones();
});
</script>
