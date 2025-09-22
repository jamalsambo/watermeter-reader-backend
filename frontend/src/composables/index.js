import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import useSupabase from "boot/supabase";
import { v4 as uuidv4 } from "uuid";

export const useComposablesStores = defineStore("composables", {
  state: () => ({
    userSupabase: ''
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async uploadFromSupabase(file, storage) {
      const { supabase } = useSupabase();
      const filename = uuidv4();
      const { error } = supabase.storage.from(storage).upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });
      const publicUrl = this.getURlPublic(filename, storage);
      if (error) throw error;
      return publicUrl;
    },
    async getURlPublic(filename, storage) {
      const { supabase } = useSupabase();

      const { data, error } = supabase
        .storage
        .from(storage)
        .getPublicUrl(filename);

      if (error) {
        throw error;
      }

      return data.publicUrl;
    },
  },
});
