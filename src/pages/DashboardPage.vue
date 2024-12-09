<template>
  <q-page padding class="page-container">
    <main id="main">
      <div class="cabecalho-dash">
        <h1>DASHBOARD</h1>
        <div class="search">
          <q-input outlined v-model="search" placeholder="Buscar..." clearable>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Gráficos e Listagem -->
      <section class="charts">
        <div class="chart-box">
          <h3>LIVROS</h3>
          <canvas id="myChart" ref="chartCanvas"></canvas>
        </div>

        <div class="books-list">
          <div class="titulo-box">
            <h3>MAIS ALUGADOS</h3>
          </div>
          <ul>
            <li>Dom Quixote</li>
            <li>O Senhor dos Anéis</li>
            <li>O Pequeno Príncipe</li>
            <li>Harry Potter e a Pedra Filosofal</li>
            <li>A Hipótese do Amor</li>
            <li>É Assim que Acaba</li>
            <li>Depois do Sim</li>
            <li>A Cabana</li>
          </ul>
        </div>
      </section>

      <!-- Tabela de Dados -->
      <section class="data-table">
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Alugueis Totais</th>
              <th>Qtd. de Livros Emprestados</th>
              <th>Alugueis Ativos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mª Luiza Soares</td>
              <td>3</td>
              <td>4</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Lucas Matos</td>
              <td>17</td>
              <td>16</td>
              <td>12</td>
            </tr>
            <tr>
              <td>Joyce Luiza</td>
              <td>15</td>
              <td>12</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Mateus Sales</td>
              <td>5</td>
              <td>9</td>
              <td>3</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </q-page>
</template>

<script>
import { nextTick } from "vue";

export default {
  name: "DashboardPage",
  data() {
    return {
      chartCanvas: null,
      search: "",
    };
  },
  methods: {
    renderChart() {
      if (this.chartCanvas) {
        const ctx = this.chartCanvas.getContext("2d");
        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: [
              "Alugados",
              "Aluguel Atrasado",
              "Devolvido no Prazo",
              "Devolvido Depois do Prazo",
            ],
            datasets: [
              {
                label: "# de Livros",
                data: [10, 10, 70, 10],
                backgroundColor: ["#00926F", "#009037", "#2C5CD0", "#18F514"],
              },
            ],
          },
        });
      } else {
        console.error("Canvas element is not available.");
      }
    },
  },
  mounted() {
    nextTick(() => {
      this.chartCanvas = this.$refs.chartCanvas;
      this.renderChart();
    });
  },
};
</script>

<style scoped>
.page-container {
  background-color: #e9f8ed;
}

.cabecalho-dash {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 30px;
}

.cabecalho-dash h1 {
  color: #006666;
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: bold;
}

.charts {
  display: flex;
  justify-content: space-between;
}

.chart-box {
  width: 30%;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chart-box h3 {
  margin: 0;
  margin-bottom: 20px;
  color: #065a60;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

.books-list {
  width: 69%;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.books-list h3 {
  margin: 0;
  margin-bottom: 10px;
  color: #065a60;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

.books-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.books-list ul li {
  padding: 10px 0;
  border-bottom: 1px solid #e5e5e5;
  color: #065a60;
}

.data-table {
  margin-top: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #065a60;
}

table thead th {
  text-align: center;
  padding-bottom: 10px;
}

table tbody tr {
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
}

table tbody tr td {
  padding: 10px 0;
}
</style>
