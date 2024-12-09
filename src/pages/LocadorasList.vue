<template>
  <q-page padding class="page-container">
    <q-card-section class="header">
      <div class="text-h5">LISTA DE LOCADORAS</div>
      <div class="search">
        <q-input outlined v-model="search" placeholder="Buscar..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-card>
      <!-- Tabela de editoras -->
      <q-table :rows="filteredEditoras" :columns="columns" row-key="id" no-data-label="Nenhuma editora encontrada" flat
        bordered>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense size="sm" icon="edit" color="grey-10" @click="editEditoras(props.row)" />
            <q-btn flat dense size="sm" icon="delete" color="grey-10" @click="deleteEditoras(props.row)" />
          </q-td>
        </template>
      </q-table>

      <!-- Botão de cadastro -->
      <q-card-section>
        <div class="button">
          <q-btn label="Cadastrar" color="cyan-10" class="full-width" to="/locadoras" @click="registerEditoras" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de Edição -->
    <q-dialog v-model="edit" persistent>
      <q-card style="border: 2px solid #066666; background-color: #e9f8ed;">
        <q-card-section class="row items-center">
          <div class="q-pa-md" style="width: 600px;">
            <q-form @submit.prevent="updateEditoras" class="q-gutter-md">
              <q-input filled v-model="editoraData.name" placeholder="Nome da Editora *" />
              <q-input filled v-model="editoraData.email" placeholder="Email *" />
              <q-input filled v-model="editoraData.telephone" placeholder="Telefone *" />
            </q-form>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Sair" color="red-8" v-close-popup />
          <q-btn flat label="Alterar" color="teal-10" @click="updateEditoras" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Exclusão -->
    <q-dialog v-model="confirm" persistent>
      <q-card style="border: 2px solid #066666; background-color: #e9f8ed;">
        <q-card-section class="row items-center">
          <q-avatar icon="person" color="primary" text-color="white" />
          <span class="q-ml-sm">Deseja excluir esta locadora?</span>
          <span class="q-ml-sm">Se você clicar em excluir, não será possível recuperar os dados desse item no
            futuro.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red-8" v-close-popup />
          <q-btn flat label="Confirmar" color="teal-10" @click="confirmDeleteEditoras" v-close-popup />
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
      edit: false,
      confirm: false,
      editoraData: {},
      editoras: [],
      columns: [
        { name: "name", label: "Nome", align: "center", field: "name" },
        { name: "email", label: "Email", align: "center", field: "email" },
        { name: "telephone", label: "Telefone", align: "center", field: "telephone" },
        { name: "actions", label: "Ações", align: "center" },
      ],
    };
  },
  computed: {
    filteredEditoras() {
      const searchLower = this.search.toLowerCase();
      return this.editoras.filter((editora) =>
        editora.name?.toLowerCase().includes(searchLower)
      );
    },
  },
  methods: {
    async fetchEditoras(page = 0, size = 50, sort = "id", direction = "ASC") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        const response = await this.$api.get('/publisher', {
          headers: {
            'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho
          },
          params: { page, size, sort, direction },
        });

        this.editoras = response.data.content || [];
        console.log("Editoras carregadas com sucesso:", this.editoras);
      } catch (error) {
        console.error("Erro ao buscar editoras:", error);
      }
    },

    editEditoras(editora) {
      this.editoraData = { ...editora };
      this.edit = true;
    },
    async updateEditoras() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }
        console.log("Edit: ", this.editoraData)
        await this.$api.put("/publisher", this.editoraData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await this.fetchEditoras();
        Notify.create({
          type: "positive",
          message: "Editora atualizada com sucesso."
        })
        console.log("Editora atualizada com sucesso.");
      } catch (error) {
        console.error("Erro ao atualizar editora:", error);
        Notify.create({
          type: "negative",
          message: `Erro ao atualizar a Editora (API Response):", ${error.response.data}`
        })
      }
    },
    deleteEditoras(editora) {
      this.editoraData = editora;
      this.confirm = true;
    },
    async confirmDeleteEditoras() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }
        await this.$api.delete(`/publisher/${this.editoraData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.fetchEditoras();
        console.log("Editora excluída com sucesso.");
        Notify.create({
          type: "warning",
          message: "Exclusão realizada com sucesso!"
        })
      } catch (error) {
        console.error("Erro ao excluir editora:", error);
        Notify.create({
          type: "negative",
          message: `Erro ao excluir editora ${error}`
        })
      }
    },
    registerEditoras() {
      console.log("Cadastro de nova editora.");
    },
  },
  created() {
    this.fetchEditoras();
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}

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
  margin-bottom: 20px;
  font-weight: bold;
}

.search {
  padding: 10px;
  cursor: pointer;
}

.button {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 30%;
  padding: 15px;
  color: white;
  border: none;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  font-size: 18px;
}
</style>
