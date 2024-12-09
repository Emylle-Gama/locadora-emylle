<template>
  <q-page padding class="page-container">
    <q-card-section class="header">
      <div class="text-h5">LISTA DE ALUGUÉIS CADASTRADOS</div>
      <div class="search">
        <q-input outlined v-model="search" placeholder="Buscar..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-card>
      <!-- Tabela de Aluguéis -->
      <q-table :rows="filteredAlugueis" :columns="columns" row-key="id" no-data-label="Nenhum aluguel encontrado" flat
        bordered>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <span v-if="props.row.status === 'DELIVERED'">Entregue</span>
            <span v-else-if="props.row.status === 'DELAYED'">Em atraso</span>
            <span v-else-if="props.row.status === 'DELIVERED_WITH_DELAY'">Entregue com atraso</span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn v-if="props.row.status !== 'DELIVERED' && props.row.status !== 'DELIVERED_WITH_DELAY'" flat dense
              size="sm" icon="undo" color="grey-10" @click="confirmReturn(props.row)" />
            <span v-else class="devolvido-msg">Devolução confirmada</span>
          </q-td>
        </template>
      </q-table>

      <!-- Botão de cadastro -->
      <q-card-section>
        <div class="button">
          <q-btn label="Cadastrar" color="cyan-10" class="full-width" @click="registerAluguel" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de Devolução -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="book" color="primary" text-color="white" />
          <span class="q-ml-sm">Deseja confirmar a devolução deste aluguel?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red-8" v-close-popup />
          <q-btn flat label="Confirmar" color="teal-10" @click="confirmarDevolucao" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Notify } from "quasar";

export default {
  name: "AlugueisPage",
  data() {
    return {
      search: "",
      confirm: false,
      editAluguelData: {},
      alugueis: [],
      columns: [
        { name: "renterName", label: "Nome do Locatário", align: "center", field: "renterName" },
        { name: "bookName", label: "Livro", align: "center", field: "bookName" },
        { name: "status", label: "Status", align: "center", field: "status" },
        { name: "rentDate", label: "Data do Aluguel", align: "center", field: "rentDate" },
        { name: "deadLineDate", label: "Data Limite", align: "center", field: "deadLineDate" },
        { name: "devolutionDate", label: "Data de Devolução", align: "center", field: "devolutionDate" },
        { name: "actions", label: "Ações", align: "center" },
      ],
    };
  },
  computed: {
    filteredAlugueis() {
      const searchLower = this.search.toLowerCase();
      return this.alugueis.filter((aluguel) =>
        aluguel.renterName?.toLowerCase().includes(searchLower)
      );
    },
  },
  methods: {
    async fetchAlugueis(page = 0, size = 100, sort = "id", direction = "ASC") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Notify.create({
            type: "negative",
            message: "Token não encontrado. Faça login novamente.",
          });
          return;
        }

        const response = await this.$api.get("/rent", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, size, sort, direction },
        });

        this.alugueis = response.data.content || [];
      } catch (error) {
        Notify.create({
          type: "negative",
          message: `Erro ao buscar aluguéis: ${error.message}`,
        });
      }
    },

    confirmReturn(aluguel) {
      this.editAluguelData = aluguel;
      this.confirm = true;
    },

    async confirmarDevolucao() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Notify.create({
            type: "negative",
            message: "Token não encontrado. Faça login novamente.",
          });
          return;
        }

        await this.$api.put(
          `/rent/${this.editAluguelData.id}`,
          { status: "DELIVERED" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Notify.create({
          type: "positive",
          message: "Devolução confirmada com sucesso.",
        });

        this.fetchAlugueis();
        this.confirm = false;
      } catch (error) {
        Notify.create({
          type: "negative",
          message: `Erro ao confirmar devolução: ${error.message}`,
        });
      }
    },

    registerAluguel() {
      this.$router.push({ path: "aluguel" });
    },
  },
  created() {
    this.fetchAlugueis();
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
  justify-content: space-between;
  align-items: center;
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
  margin: auto;
  width: 30%;
  padding: 15px;
  color: white;
  border: none;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  font-size: 18px;
}

.devolvido-msg {
  color: green;
  font-weight: bold;
}
</style>
