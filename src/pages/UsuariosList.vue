<template>
  <q-page padding class="page-container">
    <q-card-section class="header">
      <div class="text-h5">LISTA DE USUÁRIOS</div>
      <div class="search">
        <q-input outlined v-model="search" placeholder="Buscar..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-card>
      <q-table :rows="filteredUsuarios" :columns="columns" row-key="id" no-data-label="Nenhum usuário encontrado" flat
        bordered>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense size="sm" icon="edit" color="grey-10" @click="editUsuario(props.row)" />
            <q-btn flat dense size="sm" icon="delete" color="grey-10" @click="deleteUsuario(props.row)" />
          </q-td>
        </template>
      </q-table>

      <q-card-section>
        <div class="button">
          <q-btn label="Cadastrar" color="cyan-10" class="full-width" @click="registerUsuario" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de Edição -->
    <q-dialog v-model="edit" persistent>
      <q-card style="border: 2px solid #066666;">
        <q-card-section class="row items-center">
          <div class="q-pa-md" style="width: 400px;">
            <q-form @submit.prevent="updateUsuario" class="q-gutter-md">
              <q-input filled v-model="editUsuarioData.name" label="Nome *" />
              <q-input filled v-model="editUsuarioData.email" label="Email *" />
              <q-select filled v-model="editUsuarioData.role" label="Função *" :options="roles" option-value="value"
                option-label="label" emit-value clearable />
            </q-form>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red-8" v-close-popup />
          <q-btn flat label="Salvar" color="teal-10" @click="updateUsuario" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Exclusão -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm">Deseja excluir este usuário?</span>
          <span class="q-ml-sm">Essa ação é irreversível.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red-8" v-close-popup />
          <q-btn flat label="Confirmar" color="teal-10" @click="confirmDeleteUsuario" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Notify } from "quasar";
export default {
  data() {
    return {
      search: "",
      usuarios: [],
      columns: [
        { name: "id", label: "ID", align: "center", field: "id" },
        { name: "name", label: "Nome", align: "center", field: "name" },
        { name: "role", label: "Função", align: "center", field: "role" },
        { name: "actions", label: "Ações", align: "center" },
      ],
      roles: [
        { label: "Administrador", value: "ADMIN" },
        { label: "Visitante", value: "VISITOR" },
      ],
      edit: false,
      confirm: false,
      editUsuarioData: {},
      userIdToDelete: null,
    };
  },
  computed: {
    filteredUsuarios() {
      if (!this.search) return this.usuarios;
      const searchLower = this.search.toLowerCase();
      return this.usuarios.filter((usuario) =>
        usuario.name?.toLowerCase().includes(searchLower)
      );
    },
  },
  methods: {
    async fetchUsuarios(page = 0, size = 100, sort = "id", direction = "ASC") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        const response = await this.$api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, size, sort, direction },
        });

        this.usuarios = response.data.content || [];
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    },

    editUsuario(usuario) {
      this.editUsuarioData = { ...usuario };
      this.edit = true;
    },

    async updateUsuario() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        const payload = {
          id: this.editUsuarioData.id,
          name: this.editUsuarioData.name?.trim(),
          email: this.editUsuarioData.email?.trim(),
          role: this.editUsuarioData.role,
        };

        await this.$api.put("/users", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Usuário atualizado com sucesso.");
        Notify.create({
          type: "positive",
          message: "Usuário atualizado com sucesso."
        })
        await this.fetchUsuarios();
        this.edit = false;
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        Notify.create({
          type: "negative",
          message: `Erro ao atualizar usuário:", ${error})`
        })
      }
    },

    deleteUsuario(usuario) {
      this.userIdToDelete = usuario.id; // Certifique-se de que o ID está correto
      this.confirm = true;

      console.log("Usuário a ser excluído: ", usuario.id);
    },

    async confirmDeleteUsuario() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        // Certifique-se de usar o ID correto
        await this.$api.delete(`/users/${this.userIdToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Usuário excluído com sucesso: ", this.userIdToDelete);

        // Atualizar lista de usuários
        await this.fetchUsuarios();

        Notify.create({
          type: "warning",
          message: "Usuário excluído com sucesso.",
        });

        this.confirm = false;
        this.userIdToDelete = null; // Limpa o ID após a exclusão
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);

        Notify.create({
          type: "negative",
          message: "Erro ao excluir usuário.",
        });

        this.confirm = false; // Fecha o modal mesmo em caso de erro
      }
    },

    registerUsuario() {
      this.$router.push({ path: "user" });
    },
  },

  created() {
    this.fetchUsuarios();
  },
};
</script>

<style scoped>
.page-container {
  background-color: #e9f8ed;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-h5 {
  color: #006666;
  font-size: 24px;
}

.button {
  display: block;
  width: 30%;
  margin: auto;
  padding: 10px;
  text-align: center;
}
</style>
