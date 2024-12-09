<template>
  <q-page padding class="page-container">
    <!-- Cabeçalho -->
    <q-card-section class="header">
      <div class="text-h5">LIVROS</div>
      <div class="search">
        <q-input outlined v-model="search" placeholder="Buscar..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <!-- Tabela de Livros e Botão de Cadastro -->
    <q-card>
      <q-table :rows="filteredBooks" :columns="columns" row-key="id" no-data-label="Nenhum livro encontrado" flat
        bordered>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense size="sm" icon="edit" color="grey-10" @click="editBook(props.row)" />
            <q-btn flat dense size="sm" icon="delete" color="grey-10" @click="deleteBook(props.row)" />
          </q-td>
        </template>
      </q-table>

      <q-card-section>
        <div class="button">
          <q-btn label="Cadastrar" color="cyan-10" class="full-width" @click="registerBook" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de Edição -->
    <q-dialog v-model="edit" persistent>
      <q-card style="border: 2px solid #066666">
        <q-card-section class="row items-center">
          <div class="q-pa-md" style="width: 600px; height: 400px">
            <q-form @submit.prevent="updateBook" class="q-gutter-md">
              <q-input filled v-model="editBookData.name" placeholder="Nome do Livro *" />
              <q-input filled v-model="editBookData.author" placeholder="Autor (a) *" />
              <q-select filled v-model="editBookData.publisher" label="Nome da Editora *" :options="publishers"
                option-value="id" option-label="name" map-options placeholder="Selecione a editora" />
              <q-input filled v-model="editBookData.releaseDate" placeholder="Data de Lançamento *">
                <template v-slot:append>
                  <q-icon name="event" />
                  <q-popup-proxy>
                    <q-date v-model="editBookData.releaseDate" mask="YYYY-MM-DD"
                      :model-value="editBookData.releaseDate || ''" />
                  </q-popup-proxy>
                </template>
              </q-input>
              <q-input filled v-model="editBookData.available" placeholder="Quantidade de Livros *" />
            </q-form>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Sair" color="red-8" v-close-popup />
          <q-btn flat label="Alterar" color="teal-10" @click="updateBook" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Exclusão -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="person" color="primary" text-color="white" />
          <span class="q-ml-sm">Deseja excluir este livro?</span>
          <span class="q-ml-sm">Se você clicar em excluir, não será possível recuperar os dados
            desse item no futuro.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red-8" v-close-popup />
          <q-btn flat label="Confirmar" color="teal-10" @click="confirmDeleteBook" />
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
      publishers: [],
      books: [],
      editBookData: {},
      columns: [
        { name: "name", label: "Nome", align: "center", field: "name" },
        { name: "author", label: "Autor(a)", align: "center", field: "author" },
        {
          name: "publisher",
          label: "Editora",
          align: "center",
          field: "publisherName",
        },
        {
          name: "available",
          label: "Disponíveis",
          align: "center",
          field: "totalQuantity",
        },
        {
          name: "rented",
          label: "Alugados",
          align: "center",
          field: "inUseQuantity",
        },
        {
          name: "releaseDate",
          label: "Dt. de Lançamento",
          align: "center",
          field: "releaseDate",
        },
        { name: "actions", label: "Ações", align: "center" },
      ],
    };
  },
  computed: {
    filteredBooks() {
      if (!this.search) return this.books;
      const searchLower = this.search.toLowerCase();
      return this.books.filter((book) =>
        book.name?.toLowerCase().includes(searchLower)
      );
    },
  },
  methods: {
    async fetchBooks(page = 0, size = 50, sort = "id", direction = "ASC") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          Notify.create({
            message: 'Você ainda não fez login.',
            type: 'warning',
            actions: [
              { label: 'Entrar', color: 'blue-grey-10', handler: () => { this.$router.push({ path: "/" }) } }
            ]
          });
          return;
        }

        // Buscar os livros
        const response = await this.$api.get("/book", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page, size, sort, direction },
        });

        const books = response.data.content;

        // Para cada livro, buscar o nome da editora
        const booksWithPublishers = await Promise.all(
          books.map(async (book) => {
            const publisherResponse = await this.$api.get(`/book/${book.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            return {
              ...book,
              publisherName: publisherResponse.data.publisherName,
              releaseDate: publisherResponse.data.launchDate,
            };
          })
        );

        this.books = booksWithPublishers;
        console.log("Livros carregados com sucesso:", this.books);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    },
    async fetchPublishers() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        const response = await this.$api.get("/publisher", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page: 0, size: 50, sort: "id", direction: "ASC" },
        });

        this.publishers = response.data.content;
        console.log("Editoras carregadas com sucesso:", this.publishers);
      } catch (error) {
        console.error("Erro ao buscar editoras:", error);
      }
    },

    editBook(book) {
      this.editBookData = { ...book };
      this.edit = true;
    },
    async updateBook() {
      try {
        // Formata a data para o formato esperado (YYYY-MM-DD)
        const formattedDate = this.editBookData.releaseDate
          ? new Date(this.editBookData.releaseDate).toISOString().split("T")[0]
          : "";

        // Prepara os dados no formato esperado pela API
        const updatePayload = {
          id: this.editBookData.id,
          name: this.editBookData.name,
          author: this.editBookData.author,
          totalQuantity: parseInt(this.editBookData.available, 10),
          launchDate: formattedDate,
          publisherId: this.editBookData.publisher.id,
        };

        console.log("Payload enviado para atualização:", updatePayload);

        // Obtém o token do localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        // Envia a requisição de atualização
        const response = await this.$api.put("/book", updatePayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Atualiza a lista de livros após sucesso
        await this.fetchBooks();

        // Fechar modal de edição
        this.edit = false;

        console.log("Atualização concluída com sucesso!");
        Notify.create({
          type: "positive",
          message: "Livro atualizado com sucesso.",
        });
      } catch (error) {
        if (error.response) {
          const errorDetail = error.response.data?.detail;

          if (error.response.status === 403) {
            Notify.create({
              type: "warning",
              message: "Você não tem acesso a essa rotina.",
            });
          } else if (errorDetail === "BookTotalQuantityCannotBeDecreased") {
            Notify.create({
              type: "negative",
              message: "A quantidade total de livros não pode ser reduzida.",
            });
          } else {
            console.error(
              "Erro ao atualizar o livro (API Response):",
              error.response.data
            );
            Notify.create({
              type: "negative",
              message: `Erro ao atualizar o livro: ${error.response.data.title || "Erro desconhecido."}`,
            });
          }
        } else {
          console.error("Erro ao atualizar o livro:", error);
          Notify.create({
            type: "negative",
            message: `Erro ao atualizar o livro: ${error.message || "Erro desconhecido."}`,
          });
        }
      }
    },

    async deleteBook(book) {
      this.editBookData = book;
      this.confirm = true;
    },
    async confirmDeleteBook() {
      try {
        await this.$api.delete(`/book/${this.editBookData.id}`);
        await this.fetchBooks();
        this.confirm = false;
        console.log("Exclusão realizada com sucesso!");
        Notify.create({
          type: "warning",
          message: "Exclusão realizada com sucesso!"
        })
      } catch (error) {
        console.error("Erro ao deletar o livro:", error);
        Notify.create({
          type: "negative",
          message: `Erro ao deletar  o livro ${error}`
        })
        this.confirm = false;
      }
    },
    registerBook() {
      console.log("Cadastro de novo livro.");
      this.$router.push({ name: "cadlivros" });
    },
  },
  created() {
    this.fetchBooks();
    this.fetchPublishers();
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
