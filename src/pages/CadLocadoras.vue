<template>
  <q-page padding class="page-container">
    <div>
      <h2>CADASTRO DE LOCADORAS</h2>
      <q-btn label="Locadoras Cadastradas" color="secondary" icon="list" to="/locadoraslist" />
    </div>
    <div class="cadastro-container">
      <div class="form-wrapper">
        <q-form class="q-gutter-md" @submit.prevent="submitForm">
          <!-- Nome -->
          <q-input label="Nome" outlined v-model="formData.name" aria-label="Nome">
            <template v-slot:append>
              <q-icon name="person" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- Email -->
          <q-input label="Email" outlined v-model="formData.email">
            <template v-slot:append>
              <q-icon name="email" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- Telefone -->
          <q-input label="Telefone" outlined v-model="formData.telephone">
            <template v-slot:append>
              <q-icon name="phone" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- Site -->
          <q-input label="Site" outlined v-model="formData.site">
            <template v-slot:append>
              <q-icon name="@" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- Botões -->
          <div class="form-buttons">
            <q-btn label="Confirmar" color="grey-4" text-color="cyan-10" type="submit" />
            <q-btn label="Cancelar" color="grey-4" text-color="cyan-10" to="/locadoraslist" />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify } from "quasar";

export default {
  name: "CadastroLocadoras",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        telephone: "",
        site: "",
      },
    };
  },
  methods: {
    async submitForm() {
      console.log("Formulário enviado com os dados:", this.formData);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      const payload = {
        name: this.formData.name,
        email: this.formData.email,
        telephone: this.formData.telephone,
        site: this.formData.site,
      };
      console.log("Payload: ", payload);


      try {
        const response = await this.$api.post("/publisher", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Locadora cadastrada com sucesso!", response.data);
        Notify.create({
          type: "positive",
          message: "Locadora cadastrada com sucesso!"
        })
        //this.$router.push("/locadoraslist");
      } catch (error) {
        console.error("Erro ao cadastrar locadora:", error.response.data);
        Notify.create({
          type: "negative",
          message: `Erro ao cadastrar locadora ${error}`
        })
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
