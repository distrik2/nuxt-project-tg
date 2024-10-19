<template>
  <div>
    <form @submit.prevent="submitForm">
      <div>
        <label for="first_name">First Name:</label>
        <input v-model="first_name" id="first_name" type="text" required />
      </div>

      <div>
        <label for="telegram_id">Telegram ID:</label>
        <input v-model="telegram_id" id="telegram_id" type="text" required />
      </div>

      <button type="submit">Submit</button>
    </form>

    <div v-if="successMessage">{{ successMessage }}</div>
    <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      first_name: "",
      telegram_id: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async submitForm() {
      const { $supabase } = useNuxtApp(); // Получаем доступ к Supabase

      try {
        const { data, error } = await $supabase
          .from("users") // название таблицы в Supabase
          .insert([
            {
              first_name: this.first_name,
              telegram_id: this.telegram_id,
            },
          ]);

        if (error) {
          throw error;
        }

        this.successMessage = "Data submitted successfully!";
        this.first_name = "";
        this.telegram_id = "";
      } catch (error: any) {
        this.errorMessage = "Error submitting data: " + error.message;
      }
    },
  },
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 20px auto;
}

form div {
  margin-bottom: 10px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}
</style>
