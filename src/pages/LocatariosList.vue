<template>
  <q-page padding class="page-container">
    <q-card-section class="header">
      <div class="text-h5">LISTA DE LOCATÁRIOS</div>
      <div class="search">
        <q-input outlined v-model="search" placeholder="Buscar..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-card>
      <!-- Tabela de locatários -->
      <q-table :rows="filteredLocatarios" :columns="columns" row-key="id" no-data-label="Nenhum locatário encontrado"
        flat bordered>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense size="sm" icon="edit" color="grey-10" @click="editLocatario(props.row)" />
            <q-btn flat dense size="sm" icon="delete" color="grey-10" @click="deleteLocatario(props.row)" />
          </q-td>
        </template>
      </q-table>

      <!-- Botão de cadastro -->
      <q-card-section>
        <div class="button">
          <q-btn label="Cadastrar" color="cyan-10" class="full-width" @click="registerLocatario" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de Edição -->
    <q-dialog v-model="edit" persistent>
      <q-card style="border: 2px solid #066666;">
        <q-card-section class="row items-center">
          <div class="q-pa-md" style="width: 400px;">
            <q-form @submit.prevent="updateLocatario" class="q-gutter-md">
              <q-input filled v-model="editLocatarioData.name" placeholder="Nome *" />
              <q-input filled v-model="editLocatarioData.email" placeholder="Email *" />
              <q-input filled v-model="editLocatarioData.telephone" placeholder="Telefone *" />
              <q-input filled v-model="editLocatarioData.address" placeholder="Endereço *" />
              <q-input filled v-model="editLocatarioData.cpf" placeholder="CPF *" />
            </q-form>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red-8" v-close-popup />
          <q-btn flat label="Salvar" color="teal-10" @click="updateLocatario" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Exclusão -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="person" color="primary" text-color="white" />
          <span class="q-ml-sm">Deseja excluir este locatário?</span>
          <span class="q-ml-sm">Essa ação é irreversível.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red-8" v-close-popup />
          <q-btn flat label="Confirmar" color="teal-10" @click="confirmDeleteLocatario" v-close-popup />
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
      confirm: false,
      edit: false,
      editLocatarioData: {},
      locatarios: [],
      columns: [
        { name: "name", label: "Nome", align: "center", field: "name" },
        { name: "email", label: "Email", align: "center", field: "email" },
        { name: "telephone", label: "Telefone", align: "center", field: "telephone" },
        { name: "actions", label: "Ações", align: "center" },
      ],
    };
  },
  computed: {
    filteredLocatarios() {
      if (!this.search) return this.locatarios;
      const searchLower = this.search.toLowerCase();
      return this.locatarios.filter((locatario) =>
        locatario.name.toLowerCase().includes(searchLower)
      );
    },
  },
  methods: {
    async fetchLocatarios(page = 0, size = 10, sort = "id", direction = "ASC") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        const response = await this.$api.get("/renter", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, size, sort, direction },
        });

        this.locatarios = response.data.content || [];
      } catch (error) {
        console.error("Erro ao buscar locatários:", error);
      }
    },

    editLocatario(locatario) {
      this.editLocatarioData = { ...locatario };
      this.edit = true;
    },

    registerLocatario() {
      console.log("Cadastro de novo livro.");
      this.$router.push({ path: "/locatarios" });
    },

    async updateLocatario() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        // Assegura o formato correto dos dados
        const payload = {
          id: this.editLocatarioData.id, // ID obrigatório
          name: this.editLocatarioData.name?.trim() || "", // Remove espaços extras
          email: this.editLocatarioData.email?.toLowerCase().trim() || "", // Formato de email
          telephone: this.editLocatarioData.telephone?.replace(/\s+/g, "") || "", // Remove espaços no telefone
          address: this.editLocatarioData.address?.trim() || "Endereço não informado", // Endereço válido
          cpf: this.editLocatarioData.cpf?.replace(/\D/g, "").slice(0, 11) || "", // Apenas números, limite 11 dígitos
        };

        // Validação básica
        if (!payload.id || !payload.name || !payload.email || !payload.telephone || !payload.address || payload.cpf.length !== 11) {
          Notify.create({
            type: "warning",
            message: "Por favor, preencha todos os campos corretamente.",
          });
          return;
        }

        // Envio do payload
        await this.$api.put("/renter", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await this.fetchLocatarios(); // Atualiza a lista de locatários
        this.edit = false; // Fecha o modal de edição
        Notify.create({
          type: "positive",
          message: "Locatário atualizado com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao atualizar locatário:", error);
        Notify.create({
          type: "negative",
          message: error.response?.data?.message || "Erro ao atualizar locatário.",
        })
      }
    },

    deleteLocatario(locatario) {
      this.editLocatarioData = { ...locatario }
      this.confirm = true
    },

    async confirmDeleteLocatario() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        await this.$api.delete(`/renter/${this.editLocatarioData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await this.fetchLocatarios();
        this.confirm = false;
      } catch (error) {
        console.error("Erro ao excluir locatário:", error);
      }
    },
  },
  created() {
    this.fetchLocatarios();
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
