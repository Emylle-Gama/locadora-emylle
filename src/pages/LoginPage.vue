<template>
  <q-page class="login-page">
    <div class="login-form-container">
      <div class="login-header">
        <h3>Fazer Login</h3>
      </div>

      <q-form class="login-form q-gutter-md" @submit.prevent="login">
        <q-input v-model="username" label="Usuário" outlined :rules="[val => !!val || 'Campo obrigatório']">
          <template v-slot:append>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input v-model="password" label="Senha" outlined :type="showPassword ? 'text' : 'password'"
          :rules="[val => !!val || 'Campo obrigatório']">
          <template v-slot:append>
            <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
              @click="togglePassword" />
          </template>
        </q-input>

        <div class="submit-button-container">
          <q-btn label="Confirmar" type="submit" color="positive" class="full-width" />
        </div>
      </q-form>

      <div class="footer-actions">
        <q-btn label="Redefinir Senha" flat color="primary" class="reset-button" @click="resetPassword" />
      </div>
    </div>

    <div class="logo-container">
      <img :src="logo" alt="Logo WDA" />
    </div>
  </q-page>
</template>

<script>
import { Notify } from "quasar";
import logo from "../assets/wda_logo.png";

export default {
  name: "LoginPage",

  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      logo,
    };
  },

  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async login() {
      try {
        if (!this.username || !this.password) {
          Notify.create({
            type: "negative",
            message: "Preencha todos os campos obrigatórios.",
          });
          return;
        }

        const response = await this.$api.post("/auth/login", {
          username: this.username,
          password: this.password,
        });

        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("username", this.username);

        Notify.create({
          type: "positive",
          message: `Bem-vindo, ${this.username}!`,
        });

        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Erro ao fazer login:", error);

        Notify.create({
          type: "negative",
          message:
            error.response?.status === 401
              ? "Usuário ou senha incorretos."
              : "Erro ao realizar login. Tente novamente mais tarde.",
        });
      }
    },

    resetPassword() {
      Notify.create({
        type: "info",
        message: "Redirecionando para redefinição de senha.",
      });

      this.$router.push("/reset-password");
    },
  },
};
</script>

<style lang="css" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  background-color: #92e3a9;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-form-container {
  width: 100%;
  max-width: 300px;
}

.login-header {
  margin-bottom: 16px;
}

.login-header h3 {
  color: #006666;
  font-size: 28px;
  margin: 0;
  text-align: center;
}

.login-form {
  background-color: white;
  padding: 24px;
  border: 1px solid #006666;
  border-radius: 30px;
  width: 100%;
}

.login-form .q-field {
  width: 100%;
}

.submit-button-container {
  margin-top: 24px;
  width: 100%;
}

.submit-button-container .q-btn {
  width: 100%;
}

.footer-actions {
  margin-top: 16px;
  text-align: center;
}

.reset-button {
  width: 100%;
  text-align: center;
}

.logo-container {
  margin-top: 32px;
  text-align: center;
}

.logo-container img {
  height: 60px;
  width: auto;
}

@media screen and (max-width: 480px) {
  .login-form {
    padding: 16px;
  }

  .login-form-container {
    max-width: 320px;
  }
}
</style>
