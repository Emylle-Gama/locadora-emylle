<template>
  <q-page padding class="page-container">
    <div class="form-wrapper">
      <div class="login-container">
      <h3>LOGIN</h3>
    </div>
      <q-form class="q-gutter-md">
        <q-input label="Nome" outlined aria-label="Nome">
          <template v-slot:append>
            <q-icon name="person" class="cursor-pointer">
            </q-icon>
          </template>
        </q-input>
        <q-input label="Email" outlined>
           <template v-slot:append>
            <q-icon name="email" class="cursor-pointer">
            </q-icon>
          </template>
        </q-input>
        <q-input label="Email" outlined>
           <template v-slot:append>
            <q-icon name="email" class="cursor-pointer">
            </q-icon>
          </template>
          </q-input>
        <div class="column">
          <q-btn label="Confirmar" color="positive" to="/dashboard" />
        </div>
      </q-form>
    </div>
    <div class="image-container">
      <img :src="logo" alt="Logo WDA" />
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import logo from '../assets/wda_logo.png';
export default {
  name: "LoginPage",
  setup() {
    return {
      password: ref(""),
      isPwd: ref(true),
      logo
    };
  },
};
</script>

<style lang="css" scoped>

* {
  margin: 0;
  padding: 0;
}

.page-container {
  background-color: #92E3A9; /* Cor de fundo desejada */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
}


.login-container h3 {
  margin-left: 12px;
  margin-bottom: 1px;
  color: #006666;
  text-align: left;
  font-size: 28px;
}

.q-gutter-md {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fff; /* Cor de fundo do formulário */
  padding: 20px;
  border: 1px solid #006666;
  border-radius: 30px;
  width: 300px;
  gap: 10px;
}

.column {
  color: white;
  padding: 15px;
  font-size: 2px;
  margin-top: 10px;
  border-radius: 20px;
  cursor: pointer;
  width: 200px;
}

/* Estilos para a imagem */
.image-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.image-container img {
  height: 60px;
  width: auto;
}

</style>
