<template>
  <q-page class="flex flex-center bg-grey-4">
    <q-card class="my-card bg-grey-2">
      <q-card-section class="q-pt-none">
        <div class="q-pa-sm">
          <q-tree :nodes="satisfiedCustomers" node-key="label" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Dados da árvore hierárquica
const satisfiedCustomers = ref([
  {
    label: 'Emylle Gama',
    avatar: 'https://github.com/Emylle-Gama.png',
    children: [
      {
        label: 'Formações',
        icon: 'school',
        children: [
          { label: 'Estudante da EEEP Dona Creusa do Carmo Rocha' },
        ]
      },
      {
        label: 'Conhecimentos',
        icon: 'history_edu',
        children: [
          { label: 'Arquitetura e Manutenção de Computadores' },
          { label: 'Banco de Dados' },
          { label: 'Redes de Computadores' },
          { label: 'Programação Web' },
          { label: 'Programação Orientada a Objeto' }
        ]
      },
    ]
  }
]);
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 85%
</style>
