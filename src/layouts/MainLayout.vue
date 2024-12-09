<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="navbar">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="q-toolbar-title">
            <!-- Titulo que aparecerá em todas as paginas -->
            Locadora de Livros
          </div>
        </q-toolbar-title>

        <div class="message">
          <!-- Verifica se o usuário está logado -->
          <span v-if="isLoggedIn">
            Olá {{ formattedUsername }}
            <q-btn flat dense icon="logout" @click="logout" />
          </span>
          <span v-else>
            Fazer Login
            <q-btn flat dense icon="login" @click="goToLogin" />
          </span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list class="custom-link-color">
        <div class="image-container">
          <img :src="logo" alt="Logo WDA" />
        </div>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import logo from "../assets/wda_logo.png";

export default {
  name: "MainLayout",
  components: {
    EssentialLink,
  },
  data() {
    return {
      username: localStorage.getItem('username'),
      leftDrawerOpen: false,
      logo: logo,
      linksList: [
        {
          title: "Dashboard",
          caption: "Pagina de dashboard",
          icon: "dashboard",
          to: "/dashboard",
        },
        {
          title: "Livros",
          caption: "Livros",
          icon: "book",
          to: "/livros",
        },
        {
          title: "Cadastro de Locatários",
          caption: "Pagina de Locatários",
          icon: "account_circle",
          to: "/locatarios",
        },
        {
          title: "Cadastro de Usuários",
          caption: "Pagina de Usuários",
          icon: "person_add",
          to: "/user",
        },
        {
          title: "Cadastro de Livros",
          caption: "Pagina de Livros",
          icon: "library_books",
          to: "/cadlivros",
        },
        {
          title: "Cadastro de Locadoras",
          caption: "Pagina de Locadoras",
          icon: "store",
          to: "/locadoras",
        },
        {
          title: "Aluguel",
          caption: "Aluguel",
          icon: "library_add_check",
          to: "/aluguel",
        },
      ],
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.username;
    },
    formattedUsername() {
      return this.username
        ? this.username.charAt(0).toUpperCase() + this.username.slice(1).toLowerCase()
        : "";
    },
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    logout() {
      // Remove os dados do localStorage e reseta o estado
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      this.username = "";
      this.$router.push("/"); // Redireciona para a página de login
    },
    goToLogin() {
      this.$router.push("/"); // Redireciona para a página de login
    },
  },
};
</script>

<style>
.custom-link-color .q-item-label {
  color: #006666;
}

.q-drawer {
  background-color: #92E3A9;
}

.image-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.image-container img {
  height: 60px;
  width: auto;
}

.q-toolbar {
  background-color: #92E3A9;
}

.q-toolbar-title {
  color: #006666;
  font-weight: bold;
}

.message {
  color: #006666;
  font-weight: bold;
}

.custom-link-color {
  color: #003838;
}

.navbar {
  color: #006666;
}
</style>
