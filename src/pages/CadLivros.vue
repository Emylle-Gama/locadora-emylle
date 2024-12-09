<template>
  <q-page padding class="page-container">
    <div>
      <h2>CADASTRO DE LIVROS</h2>
      <q-btn label="Livros Cadastrados" color="secondary" icon="list" to="/livros" />
    </div>
    <div class="cadastro-container">
      <div class="form-wrapper">
        <q-form class="q-gutter-md" @submit.prevent="submitForm">
          <!-- Nome do Livro -->
          <q-input label="Nome do Livro" outlined v-model="formData.nomeLivro" aria-label="Nome">
            <template v-slot:append>
              <q-icon name="book" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- Autor -->
          <q-input label="Autor" outlined v-model="formData.autor">
            <template v-slot:append>
              <q-icon name="person" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- Editor -->
          <q-select label="Editor" outlined v-model="formData.publisherId" :options="publisherOptions"
            option-label="name" option-value="id" emit-value map-options>
            <template v-slot:append>
              <q-icon name="home" class="cursor-pointer" />
            </template>
          </q-select>

          <!-- Data de Lançamento -->
          <q-input v-model="formData.dataLancamento" label="Data de Lançamento" outlined>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" />
              <q-popup-proxy>
                <q-date v-model="formData.dataLancamento" />
              </q-popup-proxy>
            </template>
          </q-input>

          <!-- Quantidade de Livros -->
          <q-input label="Quantidade de Livros" outlined v-model="formData.quantidade" type="number">
            <template v-slot:append>
              <q-icon name="pin" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- Botões do Formulário -->
          <div class="form-buttons">
            <q-btn label="Confirmar" color="grey-4" text-color="cyan-10" type="submit" />
            <q-btn label="Voltar" color="grey-4" text-color="cyan-10" to="/livros" />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>


<script>
import { Notify } from "quasar";

export default {
  name: "CadastroLivros",
  data() {
    return {
      formData: {
        nomeLivro: "",
        autor: "",
        publisherId: null, // Alterado para armazenar o ID do editor
        dataLancamento: "",
        quantidade: 0,
      },
      publisherOptions: [], // Para armazenar os editores carregados da API
    };
  },
  methods: {

    // Faz o fetch da listagem dos editoras disponiveis para que possamos selecionar ao cadastrar um novo livro
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
        });

        this.publisherOptions = response.data.content;
        console.log("Editoras carregadas com sucesso:", this.publisherOptions);
      } catch (error) {
        console.error("Erro ao buscar editoras:", error);
      }
    },

    async submitForm() {
      try {
        // Formatação correta da data de lançamento
        const formattedDate = this.formData.dataLancamento
          ? new Date(this.formData.dataLancamento).toISOString().split("T")[0]
          : "";

        // Monta o payload para o backend
        const bookData = {
          name: this.formData.nomeLivro,
          author: this.formData.autor,
          totalQuantity: parseInt(this.formData.quantidade, 10),
          launchDate: formattedDate,
          publisherId: this.formData.publisherId, // Usa o ID do editor selecionado
        };

        console.log("Dados do formulário:", bookData);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        // Envia os dados para a API
        const response = await this.$api.post("/book", bookData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Livro criado com sucesso:", response.data);
        Notify.create({
          type: "positive",
          message: "Livro cadastrado com sucesso."
        })

        // Limpa o formulário após sucesso
        this.resetForm();
      } catch (error) {
        console.error("Erro ao criar livro:", error);
        Notify.create({
          type: "negative",
          message: `Erro ao cadastrar ${error}`
        })
      }
    },

    resetForm() {
      this.formData = {
        nomeLivro: "",
        autor: "",
        publisherId: null,
        dataLancamento: "",
        quantidade: 0,
      };
    },
  },
  created() {
    this.fetchPublishers(); // Carrega os editores ao montar o componente
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

.cadastro-container {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border: 2px solid #006666;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-buttons button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: #006666;
  background-color: #d9d9d9;
}

.form-buttons button:hover {
  background-color: #b1b1b1;
  transition: 0.2s;
}
</style>
