<template>
  <q-page padding class="page-container">
    <div>
      <h2>CADASTRO DE USUÁRIOS</h2>
      <q-btn label="Usuários Cadastrados" color="secondary" icon="list" to="/usuarioslist" />
    </div>
    <div class="cadastro_container">
      <div class="form-wrapper">
        <q-form class="q-gutter-md" @submit.prevent="confirmarCadastro">
          <!-- Campo Nome -->
          <q-input label="Nome" outlined v-model="formData.name" aria-label="Nome" clearable>
            <template v-slot:append>
              <q-icon name="person" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- Campo Email -->
          <q-input label="Email" outlined v-model="formData.email" type="email" clearable>
            <template v-slot:append>
              <q-icon name="email" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- Campo Senha -->
          <q-input label="Senha" outlined v-model="formData.password" :type="isPwd ? 'password' : 'text'" clearable>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="togglePassword" />
            </template>
          </q-input>

          <!-- Select Role -->
          <q-select label="Função" outlined v-model="formData.role" :options="roles" option-value="value"
            option-label="label" emit-value clearable />

          <!-- Botões de Ação -->
          <div class="form_buttons">
            <q-btn label="Confirmar" color="grey-4" text-color="cyan-10" type="submit" />
            <q-btn label="Cancelar" color="grey-4" text-color="cyan-10" to="/usuarioslist" />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify } from "quasar";
export default {
  name: "CadastroUsuarios",
  data() {
    return {
      isPwd: true,
      roles: [
        { label: "Administrador", value: "ADMIN" },
        { label: "Visitante", value: "VISITOR" },
      ],
      formData: {
        name: "",
        email: "",
        password: "",
        role: "",
      },
    };
  },
  methods: {
    togglePassword() {
      this.isPwd = !this.isPwd;
    },
    async confirmarCadastro() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        // Validação Básica
        const { name, email, password, role } = this.formData;
        if (!name || !email || !password || !role) {
          console.error("Todos os campos devem ser preenchidos.");
          Notify.create({
            type: "warning",
            message: "Todos os campos devem ser preenchidos."
          })
          return;
        }

        // Payload para a API
        const payload = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
        };

        // Chamada à API
        await this.$api.post("/users", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Usuário cadastrado com sucesso.");
        Notify.create({
          type: "positive",
          message: "Usuário cadastrado com sucesso."
        })
        this.$router.push("/usuarioslist");
      } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        Notify.create({
          type: "negative",
          message: `Erro ao cadastrar usuário:", ${error}`
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

.cadastro_container {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border: 2px solid #006666;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
}

.form_buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}
</style>
