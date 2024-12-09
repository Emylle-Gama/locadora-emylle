<template>
  <q-page padding class="page-container">
    <div>
      <h2>CADASTRO DE LOCATÁRIOS</h2>
      <q-btn label="Locatários Cadastrados" color="secondary" icon="list" to="/locatarioslist" />
    </div>
    <div class="cadastro-container">
      <div class="form-wrapper">
        <q-form class="q-gutter-md" @submit.prevent="submitForm">
          <!-- Nome -->
          <q-input label="Nome" v-model="formData.nome" outlined aria-label="Nome" />

          <!-- Email -->
          <q-input label="Email" v-model="formData.email" outlined type="email" />

          <!-- Telefone -->
          <q-input label="Telefone" v-model="formData.telefone" outlined />

          <!-- Endereço -->
          <q-input label="Endereço" v-model="formData.endereco" outlined />

          <!-- CPF -->
          <q-input label="CPF" v-model="formData.cpf" outlined />

          <!-- Botões -->
          <div class="form-buttons">
            <q-btn label="Confirmar" color="teal-10" type="submit" />
            <q-btn label="Cancelar" color="grey-4" text-color="cyan-10" to="/locatarioslist" />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify } from "quasar";

export default {
  name: "CadastroLocatarios",
  data() {
    return {
      formData: {
        nome: "",
        email: "",
        telefone: "",
        endereco: "",
        cpf: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Notify.create({
            type: "negative",
            message: "Token não encontrado. Faça login novamente.",
          });
          return;
        }

        // Formatação e validação dos dados
        const payload = {
          name: this.formData.nome?.trim() || "",
          email: this.formData.email?.toLowerCase().trim() || "",
          telephone: this.formData.telefone?.replace(/\s+/g, "") || "",
          address: this.formData.endereco?.trim() || "Endereço não informado",
          cpf: this.formData.cpf?.replace(/\D/g, "").slice(0, 11) || "",
        };

        if (!payload.name || !payload.email || !payload.telephone || !payload.address || payload.cpf.length !== 11) {
          Notify.create({
            type: "warning",
            message: "Por favor, preencha todos os campos corretamente.",
          });
          return;
        }

        // Enviar os dados para a API
        await this.$api.post("/renter", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Notify.create({
          type: "positive",
          message: "Locatário cadastrado com sucesso!",
        });

        // Resetar o formulário
        this.formData = {
          nome: "",
          email: "",
          telefone: "",
          endereco: "",
          cpf: "",
        };
      } catch (error) {
        Notify.create({
          type: "negative",
          message: error.response?.data?.message || "Erro ao cadastrar locatário.",
        });
        console.error("Erro ao cadastrar locatário:", error);
      }
    },
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

.form-buttons button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: #006666;
  background-color: #d9d9d9;
}

.form-buttons button:hover {
  background-color: #b1b1b1;
  transition: 0.2s;
}
</style>
