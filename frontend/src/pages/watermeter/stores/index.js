import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useWatermeterStore = defineStore("watermeter", {
  state: () => ({
    watermeters: [],
    watermeter: {},
  }),
  getters: {},
  actions: {
    async create(params) {
      const { data, error } = await api.post("/watermeters", {
        ...params,
      });
      if (error) throw error;
      this.watermeter = data;
    },
    async update(id, params) {
      const { data, error } = await api.patch(`/watermeters/${id}`, {
        ...params,
      });
      if (error) throw error;
      this.watermeter = data;
    },
    async delete(id) {
      const { error } = await api.delete(`/watermeters/${id}`);
      if (error) throw error;
      return error
    },
    async find(params) {
      const { data, error } = await api.get("/watermeters", {params: {...params}});
      if (error) throw error;
      this.watermeters = data;
    },
    async findOne(id) {
      const { data, error } = await api.get(`/watermeters/${id}`);
      if (error) throw error;
      this.watermeter = data;
    },
    async distribute(inspectionId) {
      const { data, error } = await api.post(
        `/watermeters/distribute/${inspectionId}`
      );
      if (error) throw error;
      return data;
    },
  },
});
