<template>
  <q-page padding class="page-container">
    <div>
      <h2>REGISTRO DE ALUGUEL</h2>
      <q-btn label="Listagem de Aluguéis" color="secondary" icon="list" to="/aluguellist" />
    </div>
    <div class="cadastro-container">
      <div class="form-wrapper">
        <q-form class="q-gutter-md" @submit.prevent="registrarAluguel">
          <!-- Selecionar Locatário -->
          <q-select label="Selecione o Locatário" outlined v-model="formData.renterId" :options="locatarios"
            option-value="id" option-label="name" map-options emit-value clearable />

          <!-- Selecionar Livro -->
          <q-select label="Selecione o Livro" outlined v-model="formData.bookId" :options="livros" option-value="id"
            option-label="name" map-options emit-value clearable />

          <!-- Selecionar Data Limite de Devolução -->
          <q-input outlined v-model="formData.deadline" label="Data Limite">
            <template v-slot:append>
              <q-icon name="event" />
            </template>
            <q-popup-proxy>
              <q-date v-model="formData.deadline" mask="YYYY-MM-DD" />
            </q-popup-proxy>
          </q-input>

          <div class="form-buttons">
            <q-btn label="Confirmar" color="grey-4" text-color="cyan-10" type="submit" />
            <q-btn label="Cancelar" color="grey-4" text-color="cyan-10" to="/aluguellist" />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify } from "quasar";

export default {
  data() {
    return {
      locatarios: [], // Lista de locatários carregada da API
      livros: [], // Lista de livros carregada da API
      formData: {
        renterId: null, // ID do locatário
        bookId: null, // ID do livro
        deadline: "", // Data limite de devolução
      },
    };
  },
  methods: {
    async fetchLocatarios() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado.");

        const response = await this.$api.get("/renter", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.locatarios = response.data.content || [];
      } catch (error) {
        console.error("Erro ao buscar locatários:", error);
      }
    },
    async fetchLivros(page = 0, size = 1000, sort = "id", direction = "ASC") {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado.");

        const response = await this.$api.get("/book", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, size, sort, direction }, // Adicionando os parâmetros necessários
        });

        this.livros = response.data.content || [];
        console.log("Livros carregados com sucesso:", this.livros);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        Notify.create({
          message: 'Você ainda não fez login.',
          type: 'warning',
          actions: [
            { label: 'Entrar', color: 'blue-grey-10', handler: () => { this.$router.push({ path: "/" }) } }
          ]
        });
      }
    },
    async registrarAluguel() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado.");

        // Validação do formulário
        const { renterId, bookId, deadline } = this.formData;
        if (!renterId || !bookId || !deadline) {
          Notify.create({
            type: "negative",
            message: "Todos os campos são obrigatórios.",
          });
          return;
        }

        // Envio do payload
        const payload = {
          renterId,
          bookId,
          deadline,
        };

        await this.$api.post("/rent", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Notify.create({
          type: "positive",
          message: "Aluguel registrado com sucesso.",
        });

        this.$router.push("/aluguellist"); // Redireciona para a listagem
      } catch (error) {
        console.error("Erro ao registrar aluguel:", error);
        Notify.create({
          type: "negative",
          message: "Erro ao registrar aluguel.",
        });
      }
    },
  },
  created() {
    this.fetchLocatarios();
    this.fetchLivros();
  },
};
</script>

<style scoped>
.page-container {
  background-color: #e9f8ed;
}

h2 {
  color: #006666;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
}

.cadastro-container {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border: 2px solid #006666;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
