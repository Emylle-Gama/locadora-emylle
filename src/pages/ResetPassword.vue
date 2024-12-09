<template>
  <q-page class="reset-password-page">
    <div class="reset-password-container">
      <div class="reset-password-header">
        <h3>Redefinir Senha</h3>
      </div>

      <q-form class="reset-password-form q-gutter-md" @submit.prevent="resetPassword">
        <!-- Campo Email -->
        <q-input v-model="formData.email" label="Email" outlined :rules="[val => !!val || 'Campo obrigatório']">
          <template v-slot:append>
            <q-icon name="email" />
          </template>
        </q-input>

        <!-- Código OTP -->
        <q-input v-model="formData.otpCode" label="Código OTP" outlined type="number"
          :rules="[val => !!val || 'Campo obrigatório']">
          <template v-slot:append>
            <q-icon name="lock" />
          </template>
        </q-input>

        <!-- Nova Senha -->
        <q-input v-model="formData.newPassword" label="Nova Senha" outlined :type="showPassword ? 'text' : 'password'"
          :rules="[val => !!val || 'Campo obrigatório']">
          <template v-slot:append>
            <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
              @click="togglePassword" />
          </template>
        </q-input>

        <!-- Repetir Nova Senha -->
        <q-input v-model="formData.repeatPassword" label="Repetir Nova Senha" outlined
          :type="showPassword ? 'text' : 'password'" :rules="[val => !!val || 'Campo obrigatório']">
          <template v-slot:append>
            <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
              @click="togglePassword" />
          </template>
        </q-input>

        <!-- Botões -->
        <div class="submit-button-container">
          <q-btn label="Confirmar" type="submit" color="positive" class="full-width" />
          <q-btn label="Cancelar" flat color="primary" class="full-width" @click="cancelReset" />
        </div>
      </q-form>
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
  name: "ResetPasswordPage",
  data() {
    return {
      formData: {
        email: "",
        otpCode: "",
        newPassword: "",
        repeatPassword: "",
      },
      showPassword: false,
      logo,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async resetPassword() {
      try {
        const { email, otpCode, newPassword, repeatPassword } = this.formData;

        if (!email || !otpCode || !newPassword || !repeatPassword) {
          Notify.create({
            type: "negative",
            message: "Preencha todos os campos obrigatórios.",
          });
          return;
        }

        if (newPassword !== repeatPassword) {
          Notify.create({
            type: "negative",
            message: "As senhas não coincidem.",
          });
          return;
        }

        const payload = {
          email,
          otpCode: Number(otpCode),
          newPassword,
          repeatPassword,
        };

        console.log("Payload: ", payload)

        await this.$api.post("/users/recovery/changePassword", payload);

        Notify.create({
          type: "positive",
          message: "Senha redefinida com sucesso!",
        });

        this.$router.push("/login");
      } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        Notify.create({
          type: "negative",
          message: "Erro ao redefinir senha. Tente novamente.",
        });
      }
    },

    cancelReset() {
      this.$router.push("/login");
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

.reset-password-page {
  background-color: #92e3a9;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.reset-password-container {
  width: 100%;
  max-width: 300px;
}

.reset-password-header {
  margin-bottom: 16px;
}

.reset-password-header h3 {
  color: #006666;
  font-size: 28px;
  margin: 0;
  text-align: center;
}

.reset-password-form {
  background-color: white;
  padding: 24px;
  border: 1px solid #006666;
  border-radius: 30px;
  width: 100%;
}

.reset-password-form .q-field {
  width: 100%;
}

.submit-button-container {
  margin-top: 24px;
  width: 100%;
}

.submit-button-container .q-btn {
  width: 100%;
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
  .reset-password-form {
    padding: 16px;
  }

  .reset-password-container {
    max-width: 320px;
  }
}
</style>
