import { defineStore } from 'pinia';
import { api } from "src/boot/axios";

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [],
    empployee: {},
  }),
  getters: {

  },
  actions: {
    async create(params) {
      const { data, error } = await api.post("/employees", {
        ...params,
      });
      if (error) throw error;
      this.empployee = data;
    },
    async update(id, params) {
      const { data, error } = await api.patch(`/employees/${id}`, { ...params });
      if (error) throw error;
      this.empployee = data;
    },
    async find() {
      const { data, error } = await api.get("/employees");
      if (error) throw error;
      this.employees = data;
    },
    async findOne(id) {
      const { data, error } = await api.get(`/employees/${id}`);
      if (error) throw error;
      this.empployee = data;
    },
    async remove(id) {
      const { data, error } = await api.delete(`/employees/${id}`);
      if (error) throw error;
      return data;
    },
    async addZones(params) {
      const { data, error } = await api.post("/employees/add-zones", {
        ...params,
      });
      if (error) throw error;
      return data;
    },
    async removeZones(employee, zone) {
      const { data, error } = await api.delete(`/employees/remove-zones/${employee}/${zone}`);
      if (error) throw error;
      return data;
    },
  },
});
